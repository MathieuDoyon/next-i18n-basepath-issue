import { NextRequest } from 'next/server';

import multiTenantMiddleware from '@lib/middleware';

async function handler(req: NextRequest) {
    try {
        const res = multiTenantMiddleware(req);

        return res;
    } catch (err) {
        console.log(err);
    }
}

export const middleware = handler;
