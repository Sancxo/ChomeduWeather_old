export default function footer() {
  const currentYear = new Date().getFullYear();
  console.log(currentYear)
  return `
    <footer>
      <hr />
      <p>&copy; Simon Tirant ${currentYear}</p>
    </footer>
  `
}