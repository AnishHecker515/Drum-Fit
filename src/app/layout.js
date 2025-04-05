export const metadata = {
  title: "Drum Fit Calculator",
  description: "Check how many people and how much cement fits in a drum!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
