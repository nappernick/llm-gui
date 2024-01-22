import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const HuggingFaceInterfacePage = () => {
  return (
    <>
      <Metadata
        title="HuggingFaceInterface"
        description="HuggingFaceInterface page"
      />

      <h1>HuggingFaceInterfacePage</h1>
      <p>
        Find me in{' '}
        <code>
          ./web/src/pages/HuggingFaceInterfacePage/HuggingFaceInterfacePage.tsx
        </code>
      </p>
      <p>
        My default route is named <code>huggingFaceInterface</code>, link to me
        with `
        <Link to={routes.huggingFaceInterface()}>HuggingFaceInterface</Link>`
      </p>
    </>
  )
}

export default HuggingFaceInterfacePage
