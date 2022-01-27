# Notes

- In Tailwind CSS V3 `purge` has changed to `content`
- Conditional classes with 'classnames' package
- use svg with nextjs: npm i @svgr/webpack --save-sev
- Ctrl + Shift + Space for function parameters hint vscode

- Can do server side rendering with getServerSideProps to pass data as props (show all at once), or useEffect to render the page empty, fetch data from abckend them rerender it (page loads => data loads)

- SWR is a strategy to first return the data from cache (stale), then send the fetch request (revalidate), and finally come with the up-to-date data. With SWR, components will get a stream of data updates constantly and automatically. And the UI will be always fast and reactive

- If you export a function called getServerSideProps (Server-Side Rendering) from a page, Next.js will pre-render this page on each request using the data returned by ('getServerSideProps')[https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props]
- Tailwind uses mobile-first approach. And media query can be written like "lg:block sm:border" (meaning block and border from medium or larger screens) (sm md lg xl)
