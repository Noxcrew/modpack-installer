interface Props {
    profile: string
}

export function TwitterLink(props: Props) {
    return (
        <a
            href={`https://twitter.com/${props.profile}`}
            rel="noreferrer"
            target="_blank"
            className="text-indigo-400"
        >
            @{props.profile}
        </a>
    )
}
