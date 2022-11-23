export default function footer() {
  const currentYear = new Date().getFullYear();

  return `
    <footer>
      <hr />
      <p>&copy; <a href="https://simontirant.dev/" target="_blank" rel="noopener">Simon Tirant</a> ${currentYear}</p>
    </footer>
  `
}