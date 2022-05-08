import { prisma } from "../../database/index";
import { DomainError } from "../../errors";
import { Email, NonEmptyString, PastDate } from "../../validators";

interface IUserRequest {
    password: string;
    email: string;
    fullname: string;
    birthday: string;
    cpf: string;
    cnpj: string;
    city: string;
    state: string;
    zipcode: string;
}

interface IUserRespose {
    email: string;
    fullname: string;
}

class CreateUserClientUseCase {
    private validStates = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA', 
                           'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',];

    async execute(userRequest : IUserRequest): Promise<IUserRespose> {
        const email = Email.create(userRequest.email);
        const fullname = NonEmptyString.create('fullname', userRequest.fullname);
        const city = NonEmptyString.create('city', userRequest.city);
        const zipcode = NonEmptyString.create('zipcode', userRequest.zipcode);
        const state = NonEmptyString.create('state', userRequest.state);
        const birthday = PastDate.create(new Date(userRequest.birthday));

        if (!this.validStates.includes(state.value)) {
            throw new DomainError(`Estado inválido. Valor informado: ${state.value}`);
        }

        if (
            (
                (userRequest.cpf == "" && userRequest.cnpj == "")
                || (userRequest.cpf != "" && userRequest.cnpj != "")
            )
            || userRequest.password == ""
        ) {
            throw new DomainError("Informação inválida!");
        }

        const userAlreadExists = await prisma.usuario.findUnique({
            where: {
                email: email.value
            }
        });

        if (userAlreadExists) {
            throw new DomainError("Usuário já existe!");
        }

        const usuario = await prisma.usuario.create({
            data: {
                email: email.value,
                senha: userRequest.password
            }
        });

        const cliente = await prisma.cliente.create({
            data: {
                dt_nascimento: birthday.value,
                nome: fullname.value,
                nr_cnpj: userRequest.cnpj,
                nr_cpf: userRequest.cpf,
                fk_usuario: usuario.id_usuario
            }
        });

        await prisma.endereco.create({
            data: {
                cidade: city.value,
                estado: state.value,
                nr_cep: zipcode.value,
                fk_cliente: cliente.id_cliente
            }
        })

        return {
            email: usuario.email,
            fullname: cliente.nome
        }
    }
}

export { CreateUserClientUseCase }