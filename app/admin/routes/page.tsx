import { redirect } from 'next/navigation'

export default function RoutesPage() {
  redirect('/admin')
  return null
}
