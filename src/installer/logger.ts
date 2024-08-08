export type LogLevel = "info" | "warn" | "error"

export interface LogEntry {
    readonly level: LogLevel
    readonly message: string
    readonly data: Record<string, any>
}

export class Logger {
    readonly entries: LogEntry[] = []

    log(level: LogLevel, message: string, data?: Record<string, any>) {
        try {
            if (data && data["error"] instanceof Error) {
                data["error"] = data["error"].message
            }

            const entry: LogEntry = { level, message, data }
            this.entries.push(entry)

            const levelStyles = [
                "color: white",
                `background-color: ${Logger.getColorForLevel(level)}`,
                "padding: 2px 4px",
                "border-radius: 2px",
            ].join(";")

            if (data) {
                console.log(`%c${level}`, levelStyles, message, data)
            } else {
                console.log(`%c${level}`, levelStyles, message)
            }
        } catch (_) {}
    }

    info(message: string, data?: Record<string, any>) {
        this.log("info", message, data)
    }

    warn(message: string, data?: Record<string, any>) {
        this.log("warn", message, data)
    }

    error(message: string, data?: Record<string, any>) {
        this.log("error", message, data)
    }

    private static getColorForLevel(level: LogLevel): string {
        switch (level) {
            case "info":
                return "#42A5F5"
            case "warn":
                return "#FFEE58"
            case "error":
                return "#FF7043"
        }
    }
}
