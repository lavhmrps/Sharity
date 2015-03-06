-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 03. Feb, 2015 18:26 PM
-- Server-versjon: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sharityApp2`
--

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Card`
--

CREATE TABLE IF NOT EXISTS `Card` (
  `cardnr` varchar(16) NOT NULL,
  `name` varchar(65) NOT NULL,
  `month` varchar(2) NOT NULL,
  `year` varchar(4) NOT NULL,
  `CVC` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Donation`
--

CREATE TABLE IF NOT EXISTS `Donation` (
  `donationID` int(11) NOT NULL DEFAULT '0',
  `projectID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `date` date NOT NULL,
  `type` varchar(30) NOT NULL,
  `sum` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Friend`
--

CREATE TABLE IF NOT EXISTS `Friend` (
  `userID` int(11) NOT NULL,
  `userID2` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `News`
--

CREATE TABLE IF NOT EXISTS `News` (
`newsID` int(11) NOT NULL,
  `title` varchar(65) NOT NULL,
  `leadparagraph` text NOT NULL,
  `txt` text NOT NULL,
  `backgroundimgURL` varchar(100) NOT NULL,
  `projectID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Organization`
--

CREATE TABLE IF NOT EXISTS `Organization` (
`organizationID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `category` varchar(30) NOT NULL,
  `about` text NOT NULL,
  `password` varchar(30) NOT NULL,
  `telephonenumber` varchar(20) NOT NULL,
  `addres` varchar(50) NOT NULL,
  `zipcode` varchar(4) NOT NULL,
  `continent` varchar(20) NOT NULL,
  `logoURL` varchar(200) NOT NULL,
  `backgroundimgURL` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Post`
--

CREATE TABLE IF NOT EXISTS `Post` (
  `zipcode` varchar(4) NOT NULL,
  `city` varchar(65) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Project`
--

CREATE TABLE IF NOT EXISTS `Project` (
`projectID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `about` text NOT NULL,
  `place` varchar(50) NOT NULL,
  `backgroundimgURL` varchar(100) NOT NULL,
  `organizationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Subscription`
--

CREATE TABLE IF NOT EXISTS `Subscription` (
  `userID` int(11) NOT NULL,
  `organizationID` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `userID` int(11) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `email` varchar(65) NOT NULL,
  `phonenumber` varchar(20) NOT NULL,
  `adress` varchar(50) DEFAULT NULL,
  `zipcode` varchar(4) DEFAULT NULL,
  `pictureURL` varchar(200) DEFAULT NULL,
  `password` varchar(30) NOT NULL,
  `cardnr` varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Card`
--
ALTER TABLE `Card`
 ADD PRIMARY KEY (`cardnr`);

--
-- Indexes for table `Donation`
--
ALTER TABLE `Donation`
 ADD PRIMARY KEY (`donationID`);

--
-- Indexes for table `Friend`
--
ALTER TABLE `Friend`
 ADD PRIMARY KEY (`userID`,`userID2`);

--
-- Indexes for table `News`
--
ALTER TABLE `News`
 ADD PRIMARY KEY (`newsID`);

--
-- Indexes for table `Organization`
--
ALTER TABLE `Organization`
 ADD PRIMARY KEY (`organizationID`);

--
-- Indexes for table `Post`
--
ALTER TABLE `Post`
 ADD PRIMARY KEY (`zipcode`);

--
-- Indexes for table `Project`
--
ALTER TABLE `Project`
 ADD PRIMARY KEY (`projectID`);

--
-- Indexes for table `Subscription`
--
ALTER TABLE `Subscription`
 ADD PRIMARY KEY (`userID`,`organizationID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
 ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `News`
--
ALTER TABLE `News`
MODIFY `newsID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Organization`
--
ALTER TABLE `Organization`
MODIFY `organizationID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Project`
--
ALTER TABLE `Project`
MODIFY `projectID` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
