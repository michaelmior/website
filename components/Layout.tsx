import React, { useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { DocSearch } from '@docsearch/react'
import { HOST } from '~/lib/config'
import useStore from '~/store'
import { SectionContext } from '~/context'

type Props = {
  children: React.ReactNode
  mainClassName?: string
  metaTitle?: string
  whiteBg?: boolean
  hideAds?: boolean
}

const responsiveClasses = 'w-full xl:w-[1200px] px-2 sm:px-4 lg:px-8'

export default function Layout({ children, mainClassName, metaTitle, whiteBg, hideAds }: Props) {
  const showMobileNav = useStore(s => s.overlayNavigation === 'docs')
  const router = useRouter()
  React.useEffect(() => useStore.setState({ overlayNavigation: null }), [router.asPath])

  return (
    <div className='bg-slate-100 min-h-screen relative flex flex-col justify-between'>
      <FaviconHead />
      <Head>
        <title>JSON Schema {metaTitle ? ` - ${metaTitle}` : ''}</title>
        <meta name='description' content='JSON Schema' />
      </Head>

      <div>
        <header className={classnames(responsiveClasses, 'py-4 flex flex-row justify-between mx-auto')}>
          <div className='flex flex-row items-center'>
            <Logo />
          </div>
          <MainNavigation />
        </header>

        <div className={classnames({ 'bg-white': whiteBg })}>
          <main className={
            classnames(mainClassName, responsiveClasses, 'bg-white xl:rounded-xl py-4 mx-auto')
          }>
            {!hideAds && (
              <div>
                <script
                  async
                  type='text/javascript'
                  src='//cdn.carbonads.com/carbon.js?serve=CE7I627Y&placement=json-schemaorg'
                  id='_carbonads_js'
                />
              </div>
            )}
            {showMobileNav ? (
              <MobileDocsNav />
            ) : (
              <ContentLayout>
                {children}
              </ContentLayout>
            )}
          </main>
        </div>
      </div>

      <Footer />
      <OpenJS />
    </div>
  )
}

const ContentLayout = ({ children }: { children: any }) => {
  const section = useContext(SectionContext)
  if (section === 'docs') return (
    <div className='mx-auto flex flex-row grid grid-cols-4'>
      <div className='hidden md:block'>
        <DocsNav />
      </div>
      <div className='col-span-4 md:col-span-3'>
        {children}
      </div>
    </div>
  )
  return children
}

const MainNavigation = () => {
  const section = useContext(SectionContext)
  const docsAreActive = section === 'docs'

  return (
    <div className='py-2 flex flex-row items-center'>
      <MainNavLink
        className='hidden md:block'
        uri='/specification'
        label='Specification'
        isActive={section === 'specification'}
      />
      <MainNavLink
        className='hidden md:block'
        uri='/overview/what-is-jsonschema'
        label='Docs'
        isActive={section === 'docs'}
      />
      <div
        className={classnames('flex flex-row items-center cursor-pointer block md:hidden font-semibold p-4', {
          'text-blue-500 hover:text-blue-600': docsAreActive,
          'text-slate-600 hover:text-slate-800': !docsAreActive
        })}
        onClick={() => useStore.setState({ overlayNavigation: 'docs' })}
      >
        <img src='/icons/menu.svg' className='h-4 w-4 mr-2' />
        Docs
      </div>
      <MainNavLink
        uri='/implementations'
        label='Implementations'
        isActive={section === 'implementations'}
      />
      <MainNavLink
        uri='/blog'
        label='Blog'
        isActive={section === 'blog'}
      />
      <MainNavLink
        uri='/#community'
        label='Community'
        isActive={section === 'community'}
      />
      <Search />
    </div>
  )
}

const Search = () => {
  return (
    <DocSearch
      appId='6ZT4KX2OUI'
      apiKey='69f76fba13585144f6686622e9c8f2a8'
      indexName='json-schema'
    />
  )
}

const MainNavLink = ({ uri, label, isActive, className }: { uri: string, label: string, isActive: boolean, className?: string }) => {
  return (
    <Link href={uri}>
      <a className={classnames(className, 'font-semibold p-2 md:p-4', {
        'text-blue-500 hover:text-blue-600': isActive,
        'text-slate-600 hover:text-slate-800': !isActive
      })}
      >{label}</a>
    </Link>
  )
}

const MobileDocsNav = () => {
  return (
    <div className='flex flex-col fixed bg-white w-full h-full z-[100] top-0 left-0'>
      <div className='flex flex-row justify-between p-8 pb-0'>
        <div className='text-blue-500 text-2xl font-bold'>
          Docs
        </div>
        <div
          style={{ backgroundImage: 'url("/icons/cancel.svg")' }}
          className='h-16 w-16 bg-center bg-[length:22px_22px] bg-no-repeat -mr-4 -mt-4 cursor-pointer'
          onClick={() => useStore.setState({ overlayNavigation: null })}
        />
      </div>
      <div className='flex-1 overflow-y-scroll px-8 pt-0 pb-16'>
        <DocsNav />
      </div>
    </div>
  )
}

// const LearnNav = () => {
//   return (
//     <div className='pt-2 pr-2'>
//       <SegmentHeadline label='Getting started' />
//       <DocLink uri='/understanding-json-schema' label='Overview' />
//       <DocLink uri='/understanding-json-schema/about' label='What is a schema?' />
//       <DocLink uri='/understanding-json-schema/basics' label='The basics' />

//       <SegmentHeadline label='Examples & studies' />
//       <DocLink uri='/learn/getting-started-step-by-step' label='Creating a schema' />
//       <DocLink uri='/learn/miscellaneous-examples' label='Miscellaneous Examples' />
//       <DocLink uri='/learn/file-system' label={'Example \'File system\''} />
//       <DocLink uri='/learn/json-schema-examples' label='More examples' />
//     </div>
//   )
// }

const DocsNav = () => {
  return (
    <div suppressHydrationWarning={true} className='pt-2 pr-2'>
      <SegmentHeadline label='Overview' />
      <DocLink uri='/overview/what-is-jsonschema' label='What is JSON Schema?' />
      <SegmentHeadline label='Getting Started' />
      <DocLink uri='/learn/getting-started-step-by-step' label='Creating your first schema' />
      <div className='pl-4 pb-1 pt-1'>
        <SegmentSubtitle label='Examples' />
        <DocLink uri='/learn/miscellaneous-examples' label='Miscellaneous examples' />
        <DocLink uri='/learn/file-system' label='Modelling a file system' />
        <DocLink uri='/learn/json-schema-examples' label='Other examples' />
      </div>
      <SegmentHeadline label='Reference' />
      <DocLink uri='/learn/glossary' label='JSON Schema Glossary' />
      <DocLink uri='https://www.learnjsonschema.com/' label='Learn JSON Schema' />
      <DocLink uri='/understanding-json-schema' label='Understanding JSON Schema' />
      <div className='pl-4 pb-1 pt-1'>
        <DocLink uri='/understanding-json-schema/conventions' label='Conventions used in this book' />
        <DocLink uri='/understanding-json-schema/about' label='What is a schema?' />
        <div className='pl-4 pb-1 pt-1'>
          <DocLink uri='/understanding-json-schema/basics' label='The basics' />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink uri='/understanding-json-schema/basics#hello-world!' label='Hello, World!' />
            <DocLink uri='/understanding-json-schema/basics#the-type-keyword' label='The type keyword' />
            <DocLink uri='/understanding-json-schema/basics#declaring-a-json-schema' label='Declaring a JSON Schema' />
            <DocLink uri='/understanding-json-schema/basics#declaring-a-unique-identifier' label='Declaring a unique identifier' />
          </div>
          <SegmentSubtitle label='JSON Schema Reference' />
          <DocLink uri='/understanding-json-schema/reference/type' label='Type-specific keywords' />
          <DocLink uri='/understanding-json-schema/reference/string' label='string' />
          <DocLink uri='/understanding-json-schema/reference/regular_expressions' label='regular expressions' />
          <DocLink uri='/understanding-json-schema/reference/numeric' label='numeric types' />
          <DocLink uri='/understanding-json-schema/reference/object' label='object' />
          <DocLink uri='/understanding-json-schema/reference/array' label='array' />
          <DocLink uri='/understanding-json-schema/reference/boolean' label='boolean' />
          <DocLink uri='/understanding-json-schema/reference/null' label='null' />
          <DocLink uri='/understanding-json-schema/reference/annotations' label='Generic keywords' />
          <DocLink uri='/understanding-json-schema/reference/non_json_data' label='Media: string-encoding non-JSON data' />
          <DocLink uri='/understanding-json-schema/reference/combining' label='Schema Composition' />
          <DocLink uri='/understanding-json-schema/reference/conditionals' label='Applying Subschemas Conditionally' />
          <DocLink uri='/understanding-json-schema/reference/schema' label='Declaring a Dialect' />
          <DocLink uri='/understanding-json-schema/structuring' label='Structuring a complex schema' />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink uri='/understanding-json-schema/structuring#schema-identification' label='Schema Identification' />
            <DocLink uri='/understanding-json-schema/structuring#base-uri' label='Base URI' />
            <DocLink uri='/understanding-json-schema/structuring#ref' label='$ref' />
            <DocLink uri='/understanding-json-schema/structuring#defs' label='$defs' />
            <DocLink uri='/understanding-json-schema/structuring#recursion' label='Recursion' />
            <DocLink uri='/understanding-json-schema/structuring#extending-recursive-schemas' label='Extending Recursive Schemas' />
            <DocLink uri='/understanding-json-schema/structuring#bundling' label='Bundling' />
          </div>
        </div>
      </div>
      <DocLink uri='/specification' label='Specification' />
      <div className='pl-4 pb-1 pt-1'>
        <DocLink uri='/draft/2020-12/release-notes' label='2020-12 notes' />
        <DocLink uri='/draft/2019-09/release-notes' label='2019-09 notes' />
        <DocLink uri='/draft-07/readme' label='draft-07 notes' />
        <DocLink uri='/draft-06/readme' label='draft-06 notes' />
        <DocLink uri='/draft-05/readme' label='draft-05 notes' />
        <DocLink uri='/specification-links' label='Specification Links' />
      </div>
    </div>
  )
}

const SegmentHeadline = ({ label }: { label: string }) => {
  return (
    <div className='text-slate-900 mb-2 mt-8 font-semibold'>
      {label}
    </div>
  )
}
const SegmentSubtitle = ({ label }: { label: string }) => {
  return (
    <div className='text-slate-900 mt-2 mb-2'>
      {label}
    </div>
  )
}
const DocLink = ({ uri, label }: { uri: string, label: string | React.ReactNode }) => {
  const router = useRouter()
  const url = new URL(`${router.asPath}`, HOST)
  url.search = ''
  url.hash = ''
  const stringUrl = url.toString().substr(HOST.length, Infinity)
  const isActive = uri === stringUrl
  return (
    <Link href={uri}>
      <a
        className={classnames('block pl-4 border-l-2 py-1', {
          'text-slate-600 border-l-slate-100': !isActive,
          'text-blue-500 border-l-blue-300 font-semibold': isActive,
        })}
      >{label}</a>
    </Link>
  )
}

const Footer = () => (
  <footer className={classnames(responsiveClasses, 'mx-auto p-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ')}>
    <div className='flex flex-col items-start'>
      <div className='font-semibold text-sm text-slate-800 mb-1'>JSON Schema</div>
      <Link href='/overview/what-is-jsonschema'>
        <a className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Docs</a>
      </Link>
      <Link href='/understanding-json-schema'>
        <a className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Learn</a>
      </Link>
      <Link href='/implementations'>
        <a className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Implementations</a>
      </Link>
      <Link href='/blog'>
        <a className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Blog</a>
      </Link>
      <Link href='/specification'>
        <a className='text-sm text-slate-400 hover:text-slate-500 pt-3 sm:mb-4'>Specification</a>
      </Link>
    </div>
    <div className='flex flex-col items-start mt-8 sm:mt-0'>
      <div className='font-semibold text-sm text-slate-800 mb-1'>Learn</div>
      <a href='/learn/getting-started-step-by-step' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Getting Started Step-By-Step</a>
      <a href='/understanding-json-schema/conventions' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Conventions on json-schema.org</a>
    </div>
    <div className='flex flex-col items-start mt-8 sm:mt-0'>
      <div className='font-semibold text-sm text-slate-800 mb-1'>Community</div>
      <a href='/slack' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Slack</a>
      <a href='https://twitter.com/jsonschema' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Twitter</a>
      <a href='https://github.com/json-schema-org' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>GitHub</a>
      <a href='https://github.com/json-schema-org/community/discussions' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>GitHub Community Discussions</a>
      <a href='https://groups.google.com/g/json-schema' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Google Groups</a>
    </div>
    <div className='flex flex-col items-start mt-8 sm:mt-0'>
      <Logo />
      <a href='https://opencollective.com/json-schema' className='text-sm text-slate-400 hover:text-slate-500 pt-3 mt-2'>Open Collective</a>
      <a href='/understanding-json-schema/credits' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Acknowledgments</a>
    </div>
  </footer>
)

const OpenJS = () => (
  <div className={classnames(responsiveClasses, 'mx-auto flex flex-flow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2')}>
    <div className='flex flex-col items-start col-start-1 sm:inline md:inline lg:inline'>
      <img className='h-16 mb-3.5' src='/img/logos/openjs_foundation-logo-horizontal-color.svg' alt='color openjs foundation logo'></img>
    </div>
    <div className='flex flex-col items-start col-start-1 md:col-span-3 sm:col-start-1 sm:col-span-2'>
      <p className='text-sm mb-4'>Copyright <a className='text-blue-500 hover:text-blue-600' href='https://openjsf.org'>OpenJS Foundation</a> and JSON Schema contributors. All rights reserved. The <a className='text-blue-500 hover:text-blue-600' href='https://openjsf.org'>OpenJS Foundation</a> has registered trademarks and uses trademarks.  For a list of trademarks of the <a className='text-blue-500 hover:text-blue-600' href='https://openjsf.org'>OpenJS Foundation</a>, please see our <a className='text-blue-500 hover:text-blue-600' href='https://trademark-policy.openjsf.org'>Trademark Policy</a> and <a className='text-blue-500 hover:text-blue-600' href='https://trademark-list.openjsf.org'>Trademark List</a>.  Trademarks and logos not indicated on the <a className='text-blue-500 hover:text-blue-600' href='https://trademark-list.openjsf.org'>list of OpenJS Foundation trademarks</a> are trademarks&trade; or registered&reg; trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.</p>
      <p className='text-sm mb-4 sm:mb-8'><a className='text-blue-500 hover:text-blue-600' href='https://openjsf.org'>The OpenJS Foundation</a> | <a className='text-blue-500 hover:text-blue-600' href='https://terms-of-use.openjsf.org'>Terms of Use</a> | <a className='text-blue-500 hover:text-blue-600' href='https://privacy-policy.openjsf.org'>Privacy Policy</a> | <a className='text-blue-500 hover:text-blue-600' href='https://bylaws.openjsf.org'>Bylaws</a> | <a className='text-blue-500 hover:text-blue-600' href='https://code-of-conduct.openjsf.org'>Code of Conduct</a> | <a className='text-blue-500 hover:text-blue-600' href='https://trademark-policy.openjsf.org'>Trademark Policy</a> | <a className='text-blue-500 hover:text-blue-600' href='https://trademark-list.openjsf.org'>Trademark List</a> | <a className='text-blue-500 hover:text-blue-600' href='https://www.linuxfoundation.org/cookies'>Cookie Policy</a></p>
    </div>
    <div className='relative mt-8 flex flex-col items-start col-start-1 col-span-2 sm:col-start-1 sm:col-span-2'>
      <div className='absolute text-sm bottom-8'>© Copyright JSON Schema Organisation 2023</div>
    </div>
  </div>
)

const Logo = () => (
  <Link href='/'>
    <a>
      <div className='inline-block text-xl text-slate-900 leading-6 font-semibold flex flex-row items-center'>
        <img src='/logo-blue.svg' className='h-12 mr-2' />
        <div className='inline-block'>
          JSON<br />
          Schema
        </div>
      </div>
    </a>
  </Link>
)

const FaviconHead = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const onUpdate = React.useCallback((matcher: MediaQueryList) => {
    setIsDarkMode(matcher.matches)
  }, [])

  React.useEffect(() => {
    const matcher: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    matcher.addEventListener('change', () => onUpdate(matcher))
    onUpdate(matcher)
  }, [])

  if (isDarkMode) {
    return (
      <Head>
        <link rel='icon' type='image/svg' href='/favicon-lightblue.ico' id='dark-scheme-icon' />
      </Head>

    )
  }
  return (
    <Head>
      <link rel='icon' type='image/svg+xml' href='/favicon.ico' id='light-scheme-icon' />
    </Head>
  )
}