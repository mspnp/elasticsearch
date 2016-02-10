#!/bin/bash
initialWait=$1
nodeDownTime=$2
user=$3
node=(${@:4})
echo "running test for node: $node"
echo "waiting $initialWait seconds"
sleep $initialWait
echo "$initialWait seconds elapsed"
ssh $user@"$node" "sudo /etc/init.d/elasticsearch stop"
echo "node $node will be down for $nodeDownTime seconds"
sleep $nodeDownTime
echo "$nodeDownTime seconds elapsed"
ssh $user@"$node" "sudo /etc/init.d/elasticsearch start"
echo "done"