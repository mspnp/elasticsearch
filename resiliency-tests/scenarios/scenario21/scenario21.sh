#!/bin/bash
initialWait=$1
nodeDownTime=$2
user=$3
nodes=(${@:4})
echo "waiting $initialWait seconds"
sleep $initialWait
for node in "${nodes[@]}"
do
	echo "running test for node: $node"
	ssh $user@"$node" "sudo /etc/init.d/elasticsearch stop"
	echo "node $node will be down for $nodeDownTime seconds"
	sleep $nodeDownTime
	ssh $user@"$node" "sudo /etc/init.d/elasticsearch start"
	sleep 5 #give time for ES to recover before restarting the next node
	echo "done"
done