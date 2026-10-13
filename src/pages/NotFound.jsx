import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] pt-44 px-5 md:px-10 pb-24">
      <p className="eyebrow text-gold mb-4">404</p>
      <h1 className="h-sec mb-6">Off the frequency</h1>
      <p className="opacity-70 mb-8 max-w-sm">That page doesn’t exist. Let’s get you back to the music.</p>
      <Link to="/shop" className="btn btn-yellow">Shop the collection →</Link>
    </div>
  )
}
