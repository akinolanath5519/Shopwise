export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full px-4"> {/* Added px-4 to prevent content from touching the edges */}
        <div className="w-full max-w-md"> {/* Set max width to control the content width */}
          {children}
        </div>
      </div>
    );
  }
  