


















<!--Génère le code d’un header HTML5 à partir du titre de la page
    du charset , et de la feuille de style CSS 
    static function enTeteHTML5 ( $title , $charset , $css_sheet )
    s o r t i e du doctype . Les g u i l l e m e t s HTML sont prot é g é s par \
--------------------------------------------------------------------------------->        
<?php 
    $_POST = ['NOMS','pass','email'];

if (!empty($_POST['NOMS'])) {
    # code...
    setcookie('utilisateur',$_POST['NOMS']);
    $_COOKIE=$_POST['NOMS'];
}
?>
<!DOCTYPE html>
    <html lang ="fr-FR"> 
    <!--HEAD veut dire en tete.texte du haut de la page-->
        <head>
            <meta charset="UTF-8"\>
            <meta name="viewport" content="width=devise-width, initial-scale=1.0"\>
            <title>IBMprod</title>            
        
        </head>
        

        
    <!--BODY veut dire simplement corps.texte du milieux-->
        
        <body>
            <style>
                body{ font-family: "century gothic", 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif ,serif ;

                    background-color: rgb(11, 41, 131);
                    background-image:
                    calc(100%) ;
                    background-repeat :repeat 
                    border-box ;
                    }
                section {color: darkgoldenrod ; } 
                h1{
                
                    color: darkgoldenrod ;
                    text-decoration:underline ;
                    font-size : 300%;
                    text-align : center ;
                    
                    }
                h2{ color:darkgoldenrod;}
                h3{color: darkgoldenrod; }
                #Connexion:hover { color: white;} 
                #Connexion{
                            background-color: darkgoldenrod;
                            color: black;
                            padding: 5px 10px;
                        }
                #autre{ color:darkgoldenrod;
                        text-decoration-line: none;}
                #autre:hover { color: white;} 
                footer { 
                        font-family:oblique;
                        color:darkgoldenrod;
                        text-align: center;
                        float: absolute;
                        top: 80%;
                        left: 40%;
                        }
            </style>    
            <header>
                <h1> <img src="BEBOL/PHOTOS/IBMprodS.png" alt="logo de l'entreprise"></h1>
                <h2>
    <!--formulaire d'identifiant  du client-->
         
                <form method ="POST" id="client"action="BEBOL/Accueil.php"\>
                    <fieldset form="id_client"\>
                        <legend>Identifiant</legend>
                                <label for="NOMS">Nom d'utilisateur:</label>
                            <input type ="text" id="NOMS" name="Utilisateur" maxlength="30" placeholder="noms d'utilisateur" required="required"><br>
                                <label for="email">Email:</label>
                            <input type ="email" id="email" name="mail" placeholder="adresse électronique" maxlength="30" autofocus="autofocus" required="required"><br>
                                <label for="pass">Mot de passe :</label>
                            <input type="password" id="pass" name="pass" placeholder="Mot de passe" maxlength="20" required="required"> <br>
                                <br><input  type="submit" email="valid_form";pass="valid_form" value="Connexion" id="Connexion" > 
                           
                    </fieldset>
                </form>
                </h2>
                <p><a href="Mdp oublié.php"id="autre">Mot de passe oublié ?</a> <b> <a href="Inscription.php"id="autre">Inscription</a></p>
                <hr>
            </header>
             
        </body>
        
     <!--FOOTER veut dire bas.texte du bas de la page-->
             
             <footer>
                  <p>IBMprod45@gmail.com    IBM_prod     +243853193403</p>
                  <p>copyright &copy;BEBOL2022 par IBMprod</p>
             </footer>
</html>