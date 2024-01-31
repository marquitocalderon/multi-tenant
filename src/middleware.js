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
  // Define allowed Domains (localhost and production domain)
  const allowedDomains = ["localhost:3000", "tudominio.com"];

  // Verificamos si el hostname existe en los dominios permitidos
  // Verify if hostname exist in allowed domains
  const isAllowedDomain = allowedDomains.some(domain => hostname.includes(domain));

  // Extraemos el posible subdominio en la URL
  // Extract the possible subdomain in the URL
  const subdomain = hostname.split('.')[0];

  // Si estamos en un dominio habilitado y no es un subdominio, permitimos la solicitud.
  // If we stay in a allowed domain and its not a subdomain, allow the request.
  if (isAllowedDomain && !subdomains.some(d => d.subdomain === subdomain)) {
    return NextResponse.next();
  }

  const subdomainData = subdomains.find(d => d.subdomain === subdomain);

  if (subdomainData) {
    // Rewrite the URL in the dynamic route based in the subdomain
    // Reescribe la URL a una ruta dinámica basada en el subdominio
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }

  return new Response(null, { status: 404 });
}