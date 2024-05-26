declare global {
    interface Window {
        main: {
            send: (channel: string, ...args) => void,
            receive: (channel: string, Function) => void,
            stop: (channel: string) => void
        }
    }
}

export async function sendEvent (channel: string, ...args) {
    return new Promise((resolve, reject) => {
        window.main.receive(`${channel}-success`, event => {
            window.main.stop(channel);
            resolve(event);
        });

        window.main.send(channel, ...args);

        const timeout = setTimeout(() => {
            reject(new Error("Timeout error"));
        }, 5000)

        window.main.receive(`${channel}-error`, event => {
            clearTimeout(timeout);
            window.main.stop(channel);
            reject(event);
        })
    })
}