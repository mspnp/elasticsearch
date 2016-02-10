#!/bin/bash
initialWait=$1
nodeDownTime=$2
user=$3
clusterName=$4
node=(${@:5})
echo "running test for node: $node"
echo "waiting $initialWait seconds"
sleep $initialWait
echo "$initialWait seconds elapsed"
ssh $user@"$node" "sudo /etc/init.d/elasticsearch stop"
echo "deleting node: $node disks"
ssh $user@"$node" "sudo rm -rf /datadisks/disk?/elasticsearch/data/$clusterName"
echo "node $node will be down for $nodeDownTime seconds"
sleep $nodeDownTime
echo "$nodeDownTime seconds elapsed"
ssh $user@"$node" "sudo /etc/init.d/elasticsearch start"
echo "done"