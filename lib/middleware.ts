import { NextResponse, type NextRequest } from 'next/server';

const excludedPrefixes = ['/favicon', '/api', '/_next'];

const PUBLIC_FILE = /\.(.*)$/;

const COOKIE_NAME = 'n_tenant';
const X_HEADER_NAME = 'x-n-tenant';

const getIsPageRequest = (req: NextRequest): boolean => {
    const { pathname } = req.nextUrl;

    return (
        !PUBLIC_FILE.test(pathname) &&
        !excludedPrefixes.find((path) => pathname?.startsWith(path))
    );
};

function resolveTenantRoutes(tenantName: string, pathname: string): string {
    return tenantName?.length
        ? `/_tenants/${tenantName}${pathname}`
        : `/_tenants/[tenant]${pathname}`;
}

export const handleTenantRequest = (
    req: NextRequest,
    tenant?: string
): NextResponse | Response => {
    const isPageRequest = getIsPageRequest(req);

    if (!isPageRequest) {
        return NextResponse.next();
    }

    const url = req.nextUrl;
    console.log('[NEXT URL]', url);
    // Prevent security issues – users should not be able to canonically access
    // the pages/_tenants folder and its respective contents. This can also be done
    // via rewrites to a custom 404 page
    if (url.pathname.startsWith(`/_tenants`)) {
        url.pathname = '/404';

        return NextResponse.rewrite(url);
    }

    // rewrite to the current hostname under the pages/_tenants folder
    // the main logic component will happen in pages/_tenants/[tenant]/index.tsx
    const tenantSlug = tenant ?? 'nesto';

    console.log('[BEFORE]: url.pathname', url.pathname);
    url.pathname = resolveTenantRoutes(tenantSlug, url.pathname);
    // TODO? TBD Should we add tenant in query?
    // Anwser: No, because Next.js will handle it. and injext route params as query params
    // url.searchParams.set('__TENANT__', tenantName ?? 'nesto');

    console.log('[AFTER]: url.pathname', url.pathname);

    const res = NextResponse.rewrite(url);

    // Define cookie
    // Add the tenant to cookies if it's not there
    const hasTenantCookie = req.cookies.has(COOKIE_NAME);
    const isSameTanant = req.cookies.get(COOKIE_NAME) === tenantSlug;
    if (
        hasTenantCookie === false ||
        (hasTenantCookie && isSameTanant === false)
    ) {
        res.cookies.set(COOKIE_NAME, tenantSlug);
    }

    res.headers.set(X_HEADER_NAME, tenantSlug);

    return res;
};

export async function handleMiddleware(req: NextRequest) {
    // Fetch our backend service to get the tenant from request hostname

    // const hostname = req.headers.get('host') || ''; // get hostname of request (e.g. demo.vercel.pub)
    // const tenantSearchUrl = process.env.TENANT_SEARCH_URL;

    // const res = await fetch(
    //   `${tenantSearchUrl}?hostname=${encodeURIComponent(hostname)}`
    // );
    // const tenant = await res.json();

    const tenant = { name: 'my-tenant-name', slug: 'my-tenant-name' };

    return handleTenantRequest(req, tenant.slug);
}

export default handleMiddleware;
