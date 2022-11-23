export default function footer() {
  const currentYear = new Date().getFullYear();

  return `
    <footer>
      <hr />
      <p>&copy; Simon Tirant ${currentYear}</p>
    </footer>
  `
}