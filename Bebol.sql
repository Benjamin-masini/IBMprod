CREATE TABLE Produit(
   Nom VARCHAR(15),
   Num_Prod INT,
   Nature VARCHAR(50) NOT NULL,
   Prix REAL NOT NULL,
   PRIMARY KEY(Nom, Num_Prod)
);
CREATE TABLE Adresse(
   Code_postale_ INT,
   Pays VARCHAR(50) NOT NULL,
   Province__Ville VARCHAR(50) NOT NULL,
   Commune VARCHAR(50),
   Quartier VARCHAR(50),
   Rue__Avenue VARCHAR(50) NOT NULL,
   PRIMARY KEY(Code_postale_)
);

CREATE TABLE Authenticité_(
   E_mail VARCHAR(25),
   Date_anniversaire_ DATE,
   Mot_de_passe VARCHAR(50),
   Noms_Utlisateur VARCHAR(50) NOT NULL,
   Sexe VARCHAR(20) NOT NULL,
   Num_Tél INT NOT NULL,
   Code_postale_ INT NOT NULL,
   PRIMARY KEY(E_mail, Date_anniversaire_, Mot_de_passe),
   FOREIGN KEY(Code_postale_) REFERENCES Adresse(Code_postale_)
);

CREATE TABLE Acheteur(
   Num_Acheteur INT,
   E_mail VARCHAR(25) NOT NULL,
   Date_anniversaire_ DATE NOT NULL,
   Mot_de_passe VARCHAR(50) NOT NULL,
   PRIMARY KEY(Num_Acheteur),
   FOREIGN KEY(E_mail, Date_anniversaire_, Mot_de_passe) REFERENCES Authenticité_(E_mail, Date_anniversaire_, Mot_de_passe)
);

CREATE TABLE Vendeur(
   Num_Vendeur INT,
   E_mail VARCHAR(25) NOT NULL,
   Date_anniversaire_ DATE NOT NULL,
   Mot_de_passe VARCHAR(50) NOT NULL,
   PRIMARY KEY(Num_Vendeur),
   FOREIGN KEY(E_mail, Date_anniversaire_, Mot_de_passe) REFERENCES Authenticité_(E_mail, Date_anniversaire_, Mot_de_passe)
);

CREATE TABLE Acheter_(
   Num_Acheteur INT,
   Nom VARCHAR(15),
   Num_Prod INT,
   PRIMARY KEY(Num_Acheteur, Nom, Num_Prod),
   FOREIGN KEY(Num_Acheteur) REFERENCES Acheteur(Num_Acheteur),
   FOREIGN KEY(Nom, Num_Prod) REFERENCES Produit(Nom, Num_Prod)
);

CREATE TABLE Vendre(
   Num_Vendeur INT,
   Nom VARCHAR(15),
   Num_Prod INT,
   PRIMARY KEY(Num_Vendeur, Nom, Num_Prod),
   FOREIGN KEY(Num_Vendeur) REFERENCES Vendeur(Num_Vendeur),
   FOREIGN KEY(Nom, Num_Prod) REFERENCES Produit(Nom, Num_Prod)
);

