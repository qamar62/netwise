import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const USERNAME = process.env.BASIC_AUTH_USERNAME
const PASSWORD = process.env.BASIC_AUTH_PASSWORD

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!USERNAME || !PASSWORD) {
    return new NextResponse('Missing BASIC_AUTH_USERNAME or BASIC_AUTH_PASSWORD', { status: 500 })
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorized()
  }

  const base64Credentials = authHeader.split(' ')[1]
  const decoded = atob(base64Credentials)
  const [username, password] = decoded.split(':')

  if (username === USERNAME && password === PASSWORD) {
    return NextResponse.next()
  }

  return unauthorized()
}

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
