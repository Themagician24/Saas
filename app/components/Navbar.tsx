"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { AudioWaveform, GlobeLock, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useCallback, useEffect } from 'react';
import { checkAndUserAddUser, getCompanyPageName } from '../actions';

const Navbar = () => {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageName, setPageName] = useState<string | null>(null);

    const navLinks = [
        { label: 'Accueil', href: '/' },
        { label: 'Vos services', href: '/services' },
        { label: 'Contact', href: '/contact' },
        { label: 'Profile', href: `/profile/${email}` },
    ];

    // Fonction pour rendre les liens de navigation
    const renderLinks = useCallback(
        (className: string) => (
            <>
                {navLinks.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`${className} btn-outline text-lime-800 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:shadow-lg transition-all duration-300`}
                    >
                        {label}
                    </Link>
                ))}
                {/* Lien supplémentaire si pageName est défini */}
                {pageName && (
                    <Link
                        key={`page-${pageName}`}
                        href={`/page/${pageName}`}
                        className={`${className} btn-outline text-lime-800 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg transition-all duration-300`}
                    >
                        <div className="flex items-center space-x-2">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                                <GlobeLock className="relative w-4 h-4 text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:rotate-12 hover:scale-110" />
                            </div>
                            <span>{pageName}</span>
                        </div>
                    </Link>
                )}
            </>
        ),
        [navLinks, pageName]
    );

    // Charger le nom de la page au montage du composant
    useEffect(() => {
        const init = async () => {
            if (email && user?.fullName) {
                await checkAndUserAddUser(email, user.fullName);
                const companyPageName = await getCompanyPageName(email);
                if (companyPageName) {
                    setPageName(companyPageName);
                }
            }
        };
        init();
    }, [user?.fullName, email]);

    return (
        <div className='border-b border-base-300 px-5 md:px-[10%] py-5 relative bg-gradient-to-r from-white to-gray-50'>
            <div className="flex justify-between items-center">
                {/* Logo et nom du site */}
                <div className='flex items-center'>
                    <div className="rounded-full p-2 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <AudioWaveform className='w-6 h-6 text-accent animate-bounce' />
                    </div>
                    <div className="relative">
                        <span className="
                            text-transparent
                            bg-gradient-to-r
                            from-green-600 to-red-600
                            hover:from-red-600
                            hover:to-yellow-500
                            bg-clip-text
                            transition-all
                            duration-500
                            font-bold
                            text-3xl
                            tracking-widest
                            uppercase
                            cursor-pointer
                            hover:animate-pulse
                        ">
                            QuickLine
                        </span>
                    </div>
                </div>

                {/* Bouton du menu mobile */}
                <button
                    className="btn w-fit btn-sm sm:hidden bg-white hover:bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Ouvrir le menu"
                >
                    <Menu className='w-4 h-4 text-gray-700 hover:text-blue-500 transition-colors duration-300' />
                </button>

                {/* Liens de navigation pour les grands écrans */}
                <div className='hidden space-x-2 sm:flex items-center'>
                    {renderLinks("btn")}
                    <div className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
                        <UserButton />
                    </div>
                </div>
            </div>

            {/* Menu pour les petits écrans */}
            <div
                className={`
                    absolute top-0 w-full bg-gradient-to-b from-white to-gray-100 h-screen flex flex-col gap-2 p-4
                    transition-all duration-300 sm:hidden z-50
                    ${menuOpen ? "left-0" : "left-full"}
                `}
            >
                <div className='flex justify-between'>
                    <div className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
                        <UserButton />
                    </div>
                    <button
                        className="btn w-fit btn-sm sm:hidden bg-white hover:bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Fermer le menu"
                    >
                        <X className='w-4 h-4 text-gray-700 hover:text-red-500 transition-colors duration-300' />
                    </button>
                </div>
                {renderLinks("btn")}
            </div>
        </div>
    );
};

export default Navbar;