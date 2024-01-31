// middleware.js
import { NextResponse } from 'next/server';
import subdomains from './subdomains.json';

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  // Define los dominios permitidos (localhost y dominio para producción)
  const allowedDomains = ["localhost:3000", "https://multi-tenant-ten.vercel.app"];

  // Verificamos si el hostname existe en los dominios permitidos
  const isAllowedDomain = allowedDomains.some(domain => hostname.includes(domain));

  // Extraemos el posible subdominio en la URL
  const subdomain = hostname.split('.')[0];

  // Si estamos en un dominio permitido y no es un subdominio, permitimos la solicitud.
  if (isAllowedDomain && !subdomains.some(d => d.subdomain === subdomain)) {
    return NextResponse.next();
  }

  // Si el subdominio existe en la lista de subdominios permitidos, reescribimos la URL.
  const subdomainData = subdomains.find(d => d.subdomain === subdomain);

  if (subdomainData) {
    // Reescribe la URL a una ruta dinámica basada en el subdominio
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }

  // Si no es un dominio permitido o subdominio permitido, devolvemos una respuesta 404.
  return new Response(null, { status: 404 });
}
