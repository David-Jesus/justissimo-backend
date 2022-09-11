import { Advogado } from "@prisma/client";
import { prisma } from "../../../database/index"
import { NotFoundError } from '../../../errors'

class ListLawyerByIdUseCase {
    async execute(id_lawyer: number) : Promise<Advogado> {
        const advogado = await prisma.advogado.findFirst({
            where: {
                id_advogado: id_lawyer,
                autorizado: true
            },
            include: {
                usuario: {
                    select: {
                        email: true,
                        url_foto_perfil: true
                    }
                },
                areas: {
                    select: {
                        areaAtuacao: true
                    }
                },
                _count: {
                    select: {
                        avaliacoes:  true,
                    },
                },
                avaliacoes  : {
                    select: {
                        id_avaliacao: true,
                        descricao: true,
                        nota: true,
                        data_avaliacao: true,
                    },
                    orderBy: {
                        data_avaliacao: 'desc'
                    }
                }
            }
        });

        if (advogado == null) {
            throw new NotFoundError("Advogado não encontrado.");
        }
            
        return advogado;
    }
}

export { ListLawyerByIdUseCase }