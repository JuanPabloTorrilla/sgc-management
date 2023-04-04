CREATE DATABASE database_sgc;

USE database_sgc;

CREATE TABLE `database_sgc`.`proceso` (
  `idproceso` INT NOT NULL AUTO_INCREMENT,
  `area` VARCHAR(100) NOT NULL,
  `alcance` VARCHAR(300) NOT NULL,
  `user` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idproceso`));

CREATE TABLE `database_sgc`.`objetivos` (
  `id` INT NOT NULL,
  `objetivo` VARCHAR(300) NOT NULL,
  `id_proceso` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `proc_id_idx` (`id_proceso` ASC) VISIBLE,
  CONSTRAINT `proc_id`
    FOREIGN KEY (`id_proceso`)
    REFERENCES `database_sgc`.`proceso` (`idproceso`)
    ON DELETE CASCADE,
    ON UPDATE NO ACTION);

CREATE TABLE `database_sgc`.`metas` (
  `idmetas` INT NOT NULL,
  `meta` VARCHAR(300) NOT NULL,
  `id_proceso` INT NULL,
  `id_objetivo` INT NULL,
  PRIMARY KEY (`idmetas`),
  INDEX `id_obj_idx` (`id_objetivo` ASC) VISIBLE,
  INDEX `id_proc_idx` (`id_proceso` ASC) VISIBLE,
  CONSTRAINT `id_obj`
    FOREIGN KEY (`id_objetivo`)
    REFERENCES `database_sgc`.`objetivos` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `id_proc`
    FOREIGN KEY (`id_proceso`)
    REFERENCES `database_sgc`.`proceso` (`idproceso`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);

CREATE TABLE `database_sgc`.`riesgos` (
  `idriesgos` INT NOT NULL AUTO_INCREMENT,
  `riesgo` VARCHAR(200) NOT NULL,
  `causa` VARCHAR(200) NOT NULL,
  `fecha_deteccion` DATETIME NOT NULL,
  `parte_afectada` VARCHAR(45) NOT NULL,
  `probabilidad_ini` VARCHAR(45) NOT NULL,
  `impacto_ini` VARCHAR(45) NOT NULL,
  `valor_riesgo` VARCHAR(45) NULL,
  `id_proceso` INT NOT NULL,
  PRIMARY KEY (`idriesgos`));

  CREATE TABLE `database_sgc`.`preventivas` (
  `idpreventivas` INT NOT NULL AUTO_INCREMENT,
  `accion` VARCHAR(300) NOT NULL,
  `frecuencia` VARCHAR(45) NOT NULL,
  `ultimo_control` DATETIME NOT NULL,
  `proximo_control` DATETIME NOT NULL,
  `probabilidad_final` VARCHAR(45) NULL,
  `impacto_final` VARCHAR(45) NULL,
  `valor_riesgo_final` VARCHAR(45) NULL,
  `resultado` VARCHAR(45) NOT NULL,
  `observaciones` VARCHAR(300) NULL,
  `id_riesgo` VARCHAR(45) NOT NULL,
  `id_proceso` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idpreventivas`));
