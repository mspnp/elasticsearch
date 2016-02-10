SET testname=%1
SET extpath=%2
SET testdir=results/%testname%
SET testPathNoExtension=%testdir%/%testname%

ECHO %1
ECHO %2
ECHO %testdir%
ECHO %testPathNoExtension%

java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-csv %testPathNoExtension%.csv --input-jtl %testPathNoExtension%.jtl --plugin-type AggregateReport

java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-csv %testPathNoExtension%-transactions.csv --input-jtl %testPathNoExtension%.jtl --plugin-type TransactionsPerSecond
java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-png %testPathNoExtension%-transactions.png --input-jtl %testPathNoExtension%.jtl --plugin-type TransactionsPerSecond

java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-csv %testPathNoExtension%-responses.csv --input-jtl %testPathNoExtension%.jtl --plugin-type ResponseTimesOverTime
java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-png %testPathNoExtension%-responses.png --input-jtl %testPathNoExtension%.jtl --plugin-type ResponseTimesOverTime

java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-csv %testPathNoExtension%-cpu.csv --input-jtl %testPathNoExtension%-perf.jtl --plugin-type PerfMon --include-labels ".*CPU.*" --include-label-regex true
java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-png %testPathNoExtension%-cpu.png --input-jtl %testPathNoExtension%-perf.jtl --plugin-type PerfMon --include-labels ".*CPU.*" --include-label-regex true

java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-csv %testPathNoExtension%-disk.csv --input-jtl %testPathNoExtension%-perf.jtl --plugin-type PerfMon --include-labels ".*Disk.*" --include-label-regex true
java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-png %testPathNoExtension%-disk.png --input-jtl %testPathNoExtension%-perf.jtl --plugin-type PerfMon --include-labels ".*Disk.*" --include-label-regex true

java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-csv %testPathNoExtension%-memory.csv --input-jtl %testPathNoExtension%-perf.jtl --plugin-type PerfMon --include-labels ".*Memory.*" --include-label-regex true
java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-png %testPathNoExtension%-memory.png --input-jtl %testPathNoExtension%-perf.jtl --plugin-type PerfMon --include-labels ".*Memory.*" --include-label-regex true

java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-csv %testPathNoExtension%-network.csv --input-jtl %testPathNoExtension%-perf.jtl --plugin-type PerfMon --include-labels ".*Network.*" --include-label-regex true
java -jar %extpath%/CMDRunner.jar --tool Reporter --generate-png %testPathNoExtension%-network.png --input-jtl %testPathNoExtension%-perf.jtl --plugin-type PerfMon --include-labels ".*Network.*" --include-label-regex true