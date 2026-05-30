"use client";
import Link from "next/link";

export default function Navbar() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
			<div className="flex h-14 w-full items-center justify-between px-6">
				
				<div className="w-full flex items-center gap-6 justify-center">
					<Link
						href="/"
						className="text-2xl font-semibold text-center tracking-tight text-zinc-900"
					>
						AI Workspace
					</Link>
				</div>
		</div>
		</header>
	);
}
