class Backend {
    static fetchTemplates(page) {
        // TODO: Replace with real implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: "Mean Tweet",
                        content: "Mean Tweet..."
                    },
                    {
                        id: 2,
                        name: "Fotowitz",
                        content: "Blah."
                    }
                ])
            }, 750);
        });
    }

    static fetchExperiments(page) {
        // TODO: Replace with real implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        title: "Mean Tweet",
                        description: "Mean Tweet..."
                    },
                    {
                        id: 2,
                        title: "Fotowitz",
                        description: "Blah."
                    }
                ]);
            }, 750);
        });
    }
}

export default Backend;