declare global {
    interface Window {
        main: {
            send: (channel: string, ...args) => void,
            receive: (channeL: string, Function) => void
        }
    }
}

export async function sendEvent (channel: string, ...args) {
    return new Promise((resolve, reject) => {
        window.main.receive(`${channel}-success`, event => {
            resolve(event);
        });

        window.main.send(channel, ...args);

        const timeout = setTimeout(() => {
            reject(new Error("Timeout error"));
        }, 5000)

        window.main.receive(`${channel}-error`, event => {
            clearTimeout(timeout);
            reject(event)
        })
    })
}