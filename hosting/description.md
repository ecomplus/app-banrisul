# Boleto Banrisul

# Antes de comerçar
Será necessário solicitar ao banco Banrisul as credenciais para a homologação do aplicativo. 

Ref.: [Documentação Api Cobrança Banrisul](https://developers-openbanking.banrisul.com.br/pages/PORTAL_V1.6.6/docs/clientes-banrisul/api-cobranca-v1.1.0.html)


<br/>

## 1)  Deverá encaminhar um e-mail solicitando a integração com a Api de cobrança. 

<br/>

Encaminhar e-mail para:  ```atendimento_teste_cobranca@banrisul.com.br```

Informações solicitadas pelo banco para cadastramento:

> CNPJ:
> 
> Razão Social:
> 
> Quantidade de requisições/chamadas por dia (aproximado)
> *(Recomendamos aqui uma média de vendas por dia X 2)* :
> 
> Nome do responsável técnico:
> 
> E-mail de contato do responsável técnico:
> 
> OBS: O “Convite” será enviado para este e-mail;
> 
> Nome da aplicação (apelido):
> 
> Por exemplo "Sua Loja E-com Banrisul”
> 
> Sandbox: sim (   ) não (   )
> 
> Produção: sim (   ) não (   )


> **Obs.:**
> *  no Sandbox não é necessário usar um código beneficiário ativo; em produção sim, mesmo que seja apenas para teste.
> 
> * se tiverem código beneficiário ativo, favor informar na resposta deste e-mail.

> Após o cadastramento vocês receberão um “Convite” no e-mail informado neste cadastro para acessar o portal e concluir o cadastramento.
> 
> Serão dois “Convites”: um para o Sandbox e outro para Produção.
> 
> Tanto em Produção quanto no Sandbox o Secret não estará visível no primeiro acesso, sendo necessário alterá-lo.
> 
> Após a alteração, em Sandbox a liberação é automática.
> 
> Em Produção o Banco deverá ser comunicado para a liberação.

<br />

## 2) Acesso ao portal do Desenvolvedor Banrisul
<br />

Após cadastro realizado no portal do Desenvolvedor do Banrisul, obtenha as credenciais de produção do banco e as adicionei ao nosso aplicativo.

* [Portal Banrisul](https://developersdev.banrisul.com.br/admin/login?to-default-config=true)

## 3) Homologação

* Crie um pedido com a opção homologação habilitada.
* Em seguida desabilite a opção homologação e crie 5 pedidos e salve os PDFs 
* Envie os 5 PDFs juntamente com os códigos de retornos, que são códigos das transações, para o e-mail: `atendimento_teste_cobranca@banrisul.com.br` para conferência.

<br />

> ***Informações Banrisul:***
> 
> A equipe Banrisul fará a conferência de campos e informações constantes nos boletos, algo que evitará transtornos futuros ou reclamações de pagadores. Se os boletos estiverem aderentes às regras abaixo, a sua organização será liberada em produção.

