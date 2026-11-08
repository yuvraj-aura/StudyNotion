export default function getRandomColors(numColors) {
    return Array.from({ length: numColors }, () =>
        `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
    );
}
