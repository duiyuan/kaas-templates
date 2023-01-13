import Layout from './index'

const WrapPage = (page: CustomPage): CustomPage => {
  page.getLayout = page => <Layout>{page}</Layout>
  return page
}

export default WrapPage
