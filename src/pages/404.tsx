import WrapPage from '@/components/base/Layout/wrap'

const Error = () => {
  return (
    <div className="page-404">
      <img src="/img/404.png" alt="404" />
      <p className="text">404</p>
    </div>
  )
}

export default WrapPage(Error)
