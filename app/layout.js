import './globals.css';

export const metadata = {
    title: 'Cozy Photobooth — Moments, even when apart.',
    description: 'A cozy digital memory studio. Capture solo or synchronized duo photos with beautiful filters and frames. Free, no login required.',
    openGraph: {
        title: 'Cozy Photobooth',
        description: 'A cozy digital memory studio. Solo & duo capture with filters, frames, and instant download.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <div className="grain-overlay" aria-hidden="true" />
                {children}
            </body>
        </html>
    );
}
