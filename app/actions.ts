"use server"

import prisma from "@/lib/prisma";

export async function checkAndUserAddUser(email: string, name: string) {
    if (!email) return

    try {
        const existingUser = await prisma.company.findUnique({
            where : {
                email: email,
            },
        })

        if (!existingUser) {
            await prisma.company.create({
                data: {
                    email: email,
                    name: name,
                },
            })
            console.log(`User with email ${email} added`)
        } else {
            console.log(`User with email ${email} already exists`)
        }
        
    } catch (error) {
        console.log(error);
    }
}



export async function createService(email: string, serviceName : string , avgTime:number) {
    if (!email ||!serviceName ||!avgTime == null) return

    try {
        const existingCompany = await prisma.company.findUnique({
            where : {
                email: email,
            },
        })
        
        if (existingCompany) {
           const newService = await prisma.service.create( {
            data: {
                name: serviceName,
                avgTime: avgTime,
                companyId: existingCompany.id
                    
                },
            
            });

          
        }else {
            console.log(`Company with email ${email} not found`);
        }
        
    } catch (error) {
        console.log(error);
        
    }

};


export async function getServicesByEmail(email: string) {
    if (!email) return 

    try {
        const company = await prisma.company.findUnique({
            where : {
                email: email,
            },
        })

        if (!company) {
            throw new Error("Aucune entreprise trouvée avec cette email .")
        }

        const services = await prisma.service.findMany({
            where: {
                companyId: company.id
            },
            include: {
                company: true,
            }
        });

        return services;
           
        
    } catch (error) {
        console.error(error);
        
    }
}






export async function deleteService(serviceId: string) {
    if (!serviceId) {
        throw new Error("L'ID du service est requis.");
    }

    try {
        // Supprimer le service directement
        await prisma.service.delete({
            where: {
                id: serviceId,
            },
        });
        console.log(`Service avec l'ID ${serviceId} supprimé avec succès.`);
        return true; // Indique que la suppression a réussi
    } catch (error) {
        console.error("Erreur lors de la suppression du service :", error);
        throw new Error("Erreur lors de la suppression du service.");
    }
}


export async function getCompanyPageName(email: string) {
    try {
        const company = await prisma.company.findUnique({
            where : {
                email: email,
            },
            select: {
                pageName: true,
            }
        })
        if (company) {
            return company.pageName;
        }
        
    } catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération du nom de la page de l'entreprise.");
        
    }
}
