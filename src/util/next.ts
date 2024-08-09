/** Default NextJS props passed into a route. */
export interface PageProps<T> {
    params: T
    searchParams: { [key: string]: string | string[] | undefined }
}

/** Props related to the installation pages. */
export interface InstallProps {
    key: string
}

/** The NextJS props passed to the installation pages. */
export type InstallPageProps = PageProps<InstallProps>
