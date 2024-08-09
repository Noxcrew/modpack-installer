/** Default NextJS props passed into a route. */
export interface PageProps<T> {
    params: T
    searchParams: { [key: string]: string | string[] | undefined }
}

export interface InstallProps {
    key: string
}

export type InstallPageProps = PageProps<InstallProps>
