"use client";

import React, { useEffect, useState } from "react";
import Wrapper from "../components/wrapper";
import { useUser } from "@clerk/nextjs";
import { createService, getServicesByEmail, deleteService } from "../actions"; // Importez deleteService
import { Service } from "@prisma/client";
import { Clock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Page = () => {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const [serviceName, setServiceName] = useState("");
    const [avgTime, setAvgTime] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [services, setServices] = useState<Service[]>([]);

    // Créer un nouveau service
    const handleCreateService = async () => {
        if (serviceName && avgTime > 0 && email) {
            try {
                await createService(email, serviceName, avgTime);
                setServiceName("");
                setAvgTime(0);
                fetchServices(); // Rafraîchir la liste des services
                toast.success("Service créé avec succès !", {
                    style: {
                        background: "#4CAF50", // Vert
                        color: "#FFFFFF", // Texte blanc
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                    iconTheme: {
                        primary: "#FFFFFF", // Icône blanche
                        secondary: "#4CAF50", // Fond vert
                    },
                });
            } catch (error) {
                console.error("Erreur lors de la création du service :", error);
                toast.error("Erreur lors de la création du service.", {
                    style: {
                        background: "#FF5252", // Rouge
                        color: "#FFFFFF", // Texte blanc
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                    iconTheme: {
                        primary: "#FFFFFF", // Icône blanche
                        secondary: "#FF5252", // Fond rouge
                    },
                });
            }
        }
    };

    // Récupérer les services de l'utilisateur
    const fetchServices = async () => {
        setLoading(true);
        try {
            if (email) {
                const serviceData = await getServicesByEmail(email);
                if (serviceData) {
                    setServices(serviceData);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des services :", error);
            toast.error("Erreur lors de la récupération des services.", {
                style: {
                    background: "#FF5252", // Rouge
                    color: "#FFFFFF", // Texte blanc
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
                iconTheme: {
                    primary: "#FFFFFF", // Icône blanche
                    secondary: "#FF5252", // Fond rouge
                },
            });
        } finally {
            setLoading(false);
        }
    };

    // Charger les services au montage du composant
    useEffect(() => {
        if (email) {
            fetchServices();
        }
    }, [email]);

    // Supprimer un service
    const handleDeleteService = async (serviceId: string) => {
        toast.custom(
            (t) => (
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-lg font-semibold mb-4">
                        Êtes-vous sûr de vouloir supprimer ce service ?
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Cette action est irréversible et supprimera également tous les tickets associés.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                                toast.dismiss(t.id); // Fermer le toast
                                confirmDelete(serviceId); // Confirmer la suppression
                            }}
                        >
                            Oui, supprimer
                        </button>
                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => toast.dismiss(t.id)} // Fermer le toast sans action
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            ),
            {
                duration: 10000, // Durée avant disparition automatique
                position: "top-center",
            }
        );
    };

    // Fonction pour confirmer la suppression
    const confirmDelete = async (serviceId: string) => {
        try {
            await deleteService(serviceId); // Appel à la fonction deleteService
            // Mettre à jour l'état local sans recharger tous les services
            setServices((prevServices) =>
                prevServices.filter((service) => service.id !== serviceId)
            );
            toast.success("Service supprimé avec succès !", {
                style: {
                    background: "#4CAF50", // Vert
                    color: "#FFFFFF", // Texte blanc
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
                iconTheme: {
                    primary: "#FFFFFF", // Icône blanche
                    secondary: "#4CAF50", // Fond vert
                },
            });
        } catch (error) {
            console.error("Erreur lors de la suppression du service :", error);
            toast.error("Désolé, la suppression a échoué. Veuillez réessayer.", {
                style: {
                    background: "#FF5252", // Rouge
                    color: "#FFFFFF", // Texte blanc
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
                iconTheme: {
                    primary: "#FFFFFF", // Icône blanche
                    secondary: "#FF5252", // Fond rouge
                },
            });
        }
    };

    return (
        <Wrapper>
            <div className="flex w-full flex-col md:flex-row gap-6 p-6">
                {/* Formulaire de création de service */}
                <div className="w-full md:w-1/4 space-y-4">
                    <h2 className="text-xl font-semibold">Créer un service</h2>

                    <div className="space-y-2">
                        <label className="label-text">Nom du service</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Nom du service"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="label-text">Temps moyen (en minutes)</label>
                        <input
                            type="number"
                            className="input input-bordered w-full"
                            placeholder="20"
                            value={avgTime}
                            onChange={(e) => setAvgTime(Number(e.target.value))}
                        />
                    </div>

                    <button
                        className="btn btn-accent w-full mt-4"
                        onClick={handleCreateService}
                        disabled={!serviceName || avgTime <= 0}
                    >
                        Créer un service
                    </button>
                </div>

                {/* Liste des services */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-xl font-semibold mb-4">Liste des services</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <span className="loading loading-spinner text-primary"></span>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center text-gray-500">Aucun service n'a été créé.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nom du service</th>
                                        <th>Temps moyen</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((service, index) => (
                                        <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                                            <td className="px-4 py-3 text-gray-900 font-semibold">
                                                {service.name}
                                            </td>
                                            <td className="px-4 py-3 flex items-center text-gray-700">
                                                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                                {service.avgTime} mins
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleDeleteService(service.id)}
                                                    className="btn btn-xs btn-error bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center shadow-md hover:shadow-lg rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
};

export default Page;