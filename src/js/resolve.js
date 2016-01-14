function resolve(uri) {
    let resolver = document.createElement("a");
    resolver.href = uri;

    return resolver;
}

export default resolve;