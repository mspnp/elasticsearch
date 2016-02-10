# Elasticsearch Resiliency Tests

This folder contains the scripts referenced by the document [How-To: Run the Automated Elasticsearch Resiliency Tests](http://path_to_doc)

## Prerequisites

The scripts requires the following items:
- A JMeter environment setup as described by the document [How-To Create a Performance Testing Environment for Elasticsearch](http://path_to_doc).

- The following additions installed on the JMeter Master VM only:

	- Java Runtime 7.
	- Nodejs 4.x.x or later.
	- The Git command line tools.


- An Elasticsearch cluster. We recommend using this [template](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Felasticsearch%2Fazuredeploy.json) (Azure)

## Installing the Prerequisite Software on a Windows VM

If the JMeter Master is a Windows VM:

- Download and run the appropriate build of the Java Runtime 7 from [here](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase7-521261.html#jre-7u80-oth-JPR).

- Download and run the appropriate Nodejs installer from [here](https://nodejs.org/dist/v4.2.2/).

- Download the Git command line tools from [here](https://git-scm.com/download/win).

## Installing the Prerequisite Software on an Ubuntu Linux VM

If the JMeter Master is an Ubuntu Linux VM:

- Install the OpenJDK version 7 package:
```
sudo apt-get update
sudo apt-get install --yes openjdk-7-jdk
```

- Install Nodejs:
```
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash
sudo apt-get install --yes nodejs
```

- Install the Git command line tools:
```
sudo apt-get install --yes git
```
## Contributing

## License
