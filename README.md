# Romantismo
App com objetivo de ajudar na organização e realização de tarefas, unindo uma interface simples, com suporte a notificações diárias sobre atividades do dia, e colaboração conjunta, onde pessoas de uma mesma turma compartilham as mesmas matérias, podendo modificá-las conforme for necessário.

# Funções
## Cadastro
Tela de cadastro, onde os usuários selecionam uma turma dentre as disponíveis. Um site onde será possível realizar a criação desssas turmas será produzido.

![alt text](https://media1.giphy.com/media/J1EzZDEbd5JmwD5rRR/giphy.gif)

## Login
Usando o email e senha já criados, o usuário poderá fazer login no aplicativo, tendo acesso apenas as matérias (listas) colaborativas da turma em que ele está enserido.

![alt text](https://media3.giphy.com/media/WR3v85llS2QVbzMncA/giphy.gif)

## Interface
Após o registro, o usuário já logado poderá acessar uma lista de atividades decorrentes de cada matéria registrada. A interface contará com tanto as informações do total de atividades registradas, como do total de atividades registradas concluidas. Acima desse registro, estará disponivel também um aviso de quando será a próxima atividade, podendo ser "ATIVIDADE PARA HOJE", "PRÓXIMA ATIVIDADE PARA: DD/MM/YY", "NENHUMA ATIVIDADE REGISTRADA" ou "ATIVIDADE ATRASADA". E mais acima ainda, poderá ver o nome (abreviado) da lista/disciplina. Caso deseje, também será possível aplicar um filtro sobre as atividades que serão mostradas dentr as listas, as filtrando por área do conhecimento (nesse caso, humanas, exatas, biologias ou técnico (informática)). Para sair/deslogar, é necessário clicar no seu nome. Após isso, aparecerá uma caixa de confirmação, onde caso o usuário clique no "SIM", será desconectado, e será necessário entrar com login de novo, ou criar uma nova conta. A função de recuperar a senha ainda está sendo trabalhada.

![alt text](https://media1.giphy.com/media/IhOWhdIqCoxST3Enuw/giphy.gif)

## Atividades
Dentro de cada lista/disciplina, haverá uma lista de atividades e tarefas, onde será possível ver o nome da atividade, a sua data de entrega, se ela está concluida ou não (demonstrado pela mensagem abaixo do nome e pela cor) e também deletá-la. Para enviar uma nova atividade para a lista, é necessário inserir tanto um nome quanto uma data de entrega. Para salvar as alterações, é necessário fechar a lista, clicando no "X" ou apertando a tecla "back" no android.

![alt text](https://media3.giphy.com/media/JpM8TJaPPTVeQS4ECW/giphy.gif)

## Notificações
O app também possui suporte ao envio de notificações. Para habilitar essa funcionalidade, é necessário apenas entrar na interface principal. Ao fazer isso, o sistema automaticamente irá analisar suas atividades, e dependendo do horário em que foi aberto, programará suas notificações. As notificações serão enviadas todos os dias as 8h da manhã. Exemplo: Caso o usuário abra o aplicativo após as 8h, o sistema programará para o dia seguinte todas as atividades que forem deste dia. Caso abra antes das 8h, escalará as notificações das atividades do próprio dia. Para essa funcionalidade ser ativada, é necessário que o usuário abra o aplicativo diariamente. E para receber notificações de novas atividades publicadas por outras pessoas, será necessário também abrir novamente o aplicativo. Tendo isso em vista, recomendo o hábito de abrir pelo menos uma vez no período da noite.
