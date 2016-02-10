# How-To: Run the Automated Elasticsearch Resiliency Tests

## Overview

The document [Configuring, Testing, and Analyzing Elasticsearch Resilience and Recovery](TBD) describes a series of tests that were performed against a sample Elasticsearch cluster to determine how well the system responded to some common forms of failure and how well it recovered. Four scenarios were tested:

1.  **Node failure and restart with no data loss**. A data node is stopped and restarted after 5 minutes. Elasticsearch was configured not to reallocate missing shards in this interval, so no additional I/O is incurred in moving shards around. When the node restarts, the recovery process brings the shards on that node back up to date.

2.  **Node failure with catastrophic data loss**. A data node is stopped and the data that it holds is erased to simulate catastrophic disk failure. The node is then restarted (after 5 minutes), effectively acting as a replacement for the original node. The recovery process requires rebuilding the missing data for this node, and may involve relocating shards held on other nodes.

3.  **Node failure and restart with no data loss, but with shard reallocation**. A data node is stopped and the shards that it holds are reallocated to other nodes. The node is then restarted and more reallocation occurs to rebalance the cluster.

4.  **Rolling updates**. Each node in the cluster is stopped and restarted after a short interval to simulate machines being rebooted after a software update. Only one node is stopped at any one time. Shards are not reallocated while a node is down.

---

These tests were scripted to enable them to be run in an automated manner. This document describes how you can repeat the tests in your own environment.

## Prerequisites

The automated tests require the following items:

1.  An Elasticsearch cluster.

2. A JMeter environment setup as described by the document [How-To Create a Performance Testing Environment for Elasticsearch](https://azure.microsoft.com/documentation/articles/guidance-elasticsearch-performance-testing-environment/).

3. The following additions installed on the JMeter Master VM only. See the [README](./resiliency-tests/README.md) file in the *resiliency-tests* folder for more information on downloading and installing these items.

    Java Runtime 7.

    Nodejs 4.x.x or later.

    The Git command line tools.

---

## How the Scripts Work

The test scripts are intended to run on the JMeter Master VM. When you select a test to run, the scripts perform the following sequence of operations:

1.  Start a JMeter test plan passing the parameters that you have specified.

2.  Copy a script that performs the operations required by the test to a specified VM in the cluster. This can be any VM that has a public IP address, or the *Jumpbox* VM if you have built the cluster using the [Azure Elasticsearch quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/elasticsearch).

3.  Run the script on the VM (or Jumpbox).

The following image shows the structure of the test environment and Elasticsearch cluster. Note that the test scripts use SSH to connect to each node in the cluster to perform various Elasticsearch operations such as stopping or restarting a node.

![](./figures/Elasticsearch/resiliency-image1.png)

## Setting up the JMeter tests

Before running the resiliency tests you should compile and deploy the JUnit tests located in the *resiliency-tests/jmeter/tests* folder. These tests are referenced by the JMeter test plan. For more information, see the procedure Importing an Existing JUnit Test Project into Eclipse in the document How-To: Create and Deploy a JMeter JUnit Sample for Testing Elasticsearch Performance.

There are two versions of the JUnit tests held in the following folders:

  * **Elasticsearch17.** The project in this folder generates the file Elasticsearch17.jar. Use this JAR for testing Elasticsearch versions 1.7.x

  * **Elasticsearch20**. The project in this folder generates the file Elasticsearch20.jar. Use this JAR for testing Elasticsearch version 2.0.0 and later

---

Copy the appropriate JAR file along with the rest of the dependencies to your JMeter machines. The process is described by the procedure Deploying a JUnit Test to JMeter in the document How-To Create and Deploy a JMeter JUnit Sampler for Testing Elasticsearch Performance.

## Configuring VM Security for Each Node

The test scripts require an authentication certificate to be installed on each Elasticsearch node in the cluster. This enables the scripts to run automatically without prompting for a username of password as they connect to the various VMs.

1.  Log in to one of the nodes in the Elasticsearch cluster (or the Jumpbox VM) and then run the following command to generate an authentication key:

  ##### Command Line
  ---
  ```
  ssh-keygen -t rsa
  ```

2.  While connected to the Elasticsearch node (or Jumpbox), run the following commands for every node in the Elasticsearch cluster. Replace *&lt;username&gt;* with the name of a valid user on each VM, and replace *&lt;nodename&gt;* with the DNS name of IP address of the VM hosting the Elasticsearch node. Note that you will be prompted for the password of the user when running these commands. For more information see [SSH login without password](http://www.linuxproblem.org/art_9.html):

  ##### Command Line
  ---
  ```
  ssh <username>@<nodename> mkdir -p .ssh

  cat .ssh/id_rsa.pub | ssh <username>@<nodename> 'cat >> .ssh/authorized\_keys'
  ```

---

## Downloading and Configuring the Test Scripts

The test scripts are provided in a Git repository. Use the following procedure to download and configure the scripts.

1.  On the JMeter master machine where you will run the tests, open a Git desktop window (Git BASH) and clone the repository that contains the scripts, as follows:

  ##### Git BASH
  ---
  ```
  git clone https://github.com/mspnp/azure-guidance/resiliency_tests
  ```

2.  Move to the *resiliency_tests* folder and run the following command to install the dependencies required to run the tests:

  ##### Git BASH
  ---
  ```
  npm install
  ```

3.  If the JMeter Master is running on Windows, [Download PLINK](http://the.earth.li/~sgtatham/putty/latest/x86/plink.exe) and copy it to the *resiliency-tests/lib* folder

4.  If the JMeter Master is running on Linux, you don’t need to download PLINK but you will need to configure password-less SSH between the JMeter Master and the Elasticsearch node or Jumpbox you used by following the steps outlined in the procedure [Configure VM Security for Each Node](#configuring-vm-security-for-each-node).

5. Start JMeter, and open the test plan insert_query.jmx located in the *resiliency-tests/jmeter/plans* folder. Expand the *Queries* thread group and edit the *Disk I/O* listener.

6. Replace the dummy *Host / IP* values with the names or IP addresses of the VMs hosting the Elasticsearch nodes in the cluster being tested. Add or remove entries as required by your cluster configuration:

  ![](./figures/Elasticsearch/resiliency-image2.png)

7. Repeat the previous step for the *Network I/O*, *Memory*, and *CPU* listeners in the *Queries* thread group, and also for the *Disk I/O*, *Network I/O*, *Memory*, and *CPU* listeners in the *Inserts* thread group.

8. Save the test plan and close JMeter.

9.  Edit the file *config.js* and edit the following configuration parameters to match your test environment and Elasticsearch cluster. There parameters are common to all of the tests:

---

| Name                     | Description                                                                                                                                                                     | Default Value         |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| jmeterPath               | Local path where jmeter is located                                                                                                                                              | C:/apache-jmeter-2.13 |
| resultsPath              | Relative directory where the script dumps the results                                                                                                                           | results               |
| verbose                  | Indicates whether the script outputs in verbose mode or not.                                                                                                                    | true                  |
| remote                   | Indicates whether the jmeter tests run locally or on the remote servers                                                                                                         | true                  |
| cluster.clusterName      | The name of the Elasticsearch’s cluster.                                                                                                                                        | elasticsearch         |
| cluster.jumpboxIp        | The IP address of the jumpbox machine. Jumpbox machine is created during Elasticsearch’s cluster deploy and is used as a proxy to execute scripts against Elasticsearch’s nodes | -                     |
| cluster.username         | The admin user you created while deploying the cluster                                                                                                                          | -                     |
| cluster.password         | The password for the admin user                                                                                                                                                 | -                     |
| cluster.loadBalancer.ip  | The IP address of the Elasticsearch’s load balancer                                                                                                                             | -                     |
| cluster.loadBalancer.url | Base URL of the load balancer                                                                                                                                                   | -                     |

## Running the Tests

1.  Move to the *resiliency-tests* folder and run the following command:

  ##### Command Line
  ---
  ```
  node app.js
  ```

  The following menu should appear:

  ![](./figures/Elasticsearch/resiliency-image3.png)


2.  Enter the number of the scenario you want to run: \[11, 12, 13 or 21\].

  Once you select a scenario, the test will run automatically. The results are stored as a set of CSV filed in a folder created under the *results* directory. Each run has its own results folder. You can use Excel to analyze and graph this data.

---