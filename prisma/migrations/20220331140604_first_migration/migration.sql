-- CreateTable
CREATE TABLE `net_escola` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(100) NOT NULL,
    `Fone` VARCHAR(500) NULL,
    `IDCidade` INTEGER NOT NULL,
    `Endereco` VARCHAR(100) NULL,
    `Numero` VARCHAR(10) NULL,
    `Complemento` VARCHAR(100) NULL,
    `Bairro` VARCHAR(100) NULL,
    `CEP` VARCHAR(10) NULL,
    `Ativo` BOOLEAN NOT NULL DEFAULT true,
    `Site` VARCHAR(60) NULL,
    `CoordenadoriaEnsino` VARCHAR(200) NULL,
    `PortariaDirigente` VARCHAR(200) NULL,
    `IP` VARCHAR(20) NULL,
    `DataCadastro` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Sessao` VARCHAR(45) NULL,
    `IDMaster` INTEGER NULL DEFAULT 0,
    `IDRegiao` INTEGER NULL DEFAULT 0,
    `Teams_ClientId` VARCHAR(150) NULL,
    `Teams_UserName` VARCHAR(150) NULL,
    `Teams_Password` VARCHAR(150) NULL,
    `Teams_EndPointKey` VARCHAR(150) NULL,
    `Teams_ClientSecret` VARCHAR(150) NULL,

    INDEX `FK_net_escola_1`(`IDCidade`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `net_news` (
    `ID_News` INTEGER NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(100) NULL,
    `Email` VARCHAR(100) NULL,
    `IP` VARCHAR(15) NULL,
    `Data` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`ID_News`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `net_perfil` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Perfil` VARCHAR(50) NOT NULL,
    `Ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `net_regioes` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDMaster` INTEGER NOT NULL,
    `Regiao` VARCHAR(60) NULL,
    `Descricao` VARCHAR(300) NULL,
    `DataCadastro` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `net_series` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Serie` VARCHAR(50) NOT NULL,
    `Ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
