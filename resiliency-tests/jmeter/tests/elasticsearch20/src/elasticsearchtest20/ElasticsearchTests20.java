package elasticsearchtest20;

import static org.junit.Assert.*;

import org.junit.*;

import java.util.*;
import java.io.*;
import java.net.*;

import org.elasticsearch.action.bulk.*;
import org.elasticsearch.common.transport.*;
import org.elasticsearch.client.transport.*;
import org.elasticsearch.common.settings.*;
import org.elasticsearch.common.xcontent.*;

public class ElasticsearchTests20 {
	
	private String [] names={"checkout","order","search","payment"};
	private String [] messages={"Incoming request from code","incoming operation succeeded with code","Operation completed time","transaction performed"};
	private String [] severity={"info","warning","transaction","verbose"};
	private String [] apps={"4D24BD62-20BF-4D74-B6DC-31313ABADB82","5D24BD62-20BF-4D74-B6DC-31313ABADB82","6D24BD62-20BF-4D74-B6DC-31313ABADB82","7D24BD62-20BF-4D74-B6DC-31313ABADB82"};

	private String hostName = "";
	private String indexName = "";
	private String typeName = "";
	private int port = 0;
	private int node = 0;
	private String clusterName = "";
	private int itemsPerBatch = 0;
	
	private static Random random = new Random();	

	@Before
	public void setUp() throws Exception {
	}
	
	public ElasticsearchTests20(String paras) {
		/* Paras is a string containing a set of comma separated values for:
		 
		   hostname
	       indexstr
	       typestr
	       port
	       clustername
	       node
	       itemsPerBatch
		 */
		
		// Note: No checking/validation is performed
		
		String delims = "[ ]*,[ ]*"; // comma surrounded by zero or more spaces
		String[] items = paras.split(delims);
		
		hostName = items[0];
		indexName = items[1];
		typeName = items[2];
		port = Integer.parseInt(items[3]);
		clusterName = items[4];
		node=Integer.parseInt(items[5]);
		
		if (node!=0) {
			port = port+(random.nextInt(node)+1);
		}
		
		itemsPerBatch = Integer.parseInt(items[6]);
		if(itemsPerBatch == 0)
		{
			itemsPerBatch = 1000;
		}
	}
	
	@Test
	public void BulkBigInsertTest20() throws IOException {
		
		Settings settings = Settings.settingsBuilder().put("cluster.name", clusterName).build();
		TransportClient client = TransportClient.builder().settings(settings).build();	                     
		
		try {
			
	        client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(hostName), port));
			BulkRequestBuilder bulkRequest = client.prepareBulk();
	        Random random = new Random();
	        char[] exmarks = new char[2000];
	        Arrays.fill(exmarks, 'x');
	        String dataString = new String(exmarks);
	        
	        for(int i=1; i< itemsPerBatch ; i++){
		        random.nextInt(10);
		        int host=random.nextInt(20);
		   
		        bulkRequest.add(client.prepareIndex(indexName, typeName).setSource(XContentFactory.jsonBuilder()
			        .startObject()
			            .field("@timestamp", new Date())
    			        .field("name", names[random.nextInt(names.length)])
	    		        .field("message", messages[random.nextInt(messages.length)])
		    	        .field("severityCode", random.nextInt(10))
			            .field("severity", severity[random.nextInt(severity.length)])
			            .field("hostname", "Hostname"+host)
			            .field("hostip", "10.1.0."+host)
    			        .field("pid",random.nextInt(10))
	    		        .field("tid",random.nextInt(10))
		    	        .field("appId", apps[random.nextInt(apps.length)])
			            .field("appName", "application"+host)
			            .field("appVersion", random.nextInt(5))
			            .field("type", random.nextInt(6))
    			        .field("subtype", random.nextInt(6))
	    		        .field("correlationId", UUID.randomUUID().toString())
		    	        .field("os", "linux")
			            .field("osVersion", "14.1.5")
			            .field("parameters", "{ke:value,key:value}")
			            .field("data1",dataString)
			            .field("data2",dataString)
			        .endObject()
			        )
			    );
		    }
		    BulkResponse bulkResponse = bulkRequest.execute().actionGet();
		    assertFalse(bulkResponse.buildFailureMessage(), bulkResponse.hasFailures());
	    }
        finally {
            client.close();
        }
    }
	
	@Test
	public void BulkDataInsertTest20() throws IOException {
		
		Settings settings = Settings.settingsBuilder().put("cluster.name", clusterName).build();
		TransportClient client = TransportClient.builder().settings(settings).build();	                     
		
		try {
			
	        client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(hostName), port));
	        BulkRequestBuilder bulkRequest = client.prepareBulk();	     
	        
	        for(int i=1; i< itemsPerBatch; i++){
		        random.nextInt(10);
		        int host=random.nextInt(20);
		   
		        bulkRequest.add(client.prepareIndex(indexName, typeName).setSource(XContentFactory.jsonBuilder()
			        .startObject()
			            .field("@timestamp", new Date())
    			        .field("name", names[random.nextInt(names.length)])
	    		        .field("message", messages[random.nextInt(messages.length)])
		    	        .field("severityCode", random.nextInt(10))
			            .field("severity", severity[random.nextInt(severity.length)])
			            .field("hostname", "Hostname"+host)
			            .field("hostip", "10.1.0."+host)
    			        .field("pid",random.nextInt(10))
	    		        .field("tid",random.nextInt(10))
		    	        .field("appId", apps[random.nextInt(apps.length)])
			            .field("appName", "application"+host)
			            .field("appVersion", random.nextInt(5))
			            .field("type", random.nextInt(6))
    			        .field("subtype", random.nextInt(6))
	    		        .field("correlationId", UUID.randomUUID().toString())
		    	        .field("os", "linux")
			            .field("osVersion", "14.1.5")
			            .field("parameters", "{ke:value,key:value}")
			        .endObject()
			        )
			    );
		    }
		    BulkResponse bulkResponse = bulkRequest.execute().actionGet();
		    assertFalse(bulkResponse.buildFailureMessage(), bulkResponse.hasFailures());
	    }
        finally {
            client.close();
        }
    }
	
	@Test
	public void BulkDataIdInsertTest20() throws IOException {
		
		Settings settings = Settings.settingsBuilder().put("cluster.name", clusterName).build();
		TransportClient client = TransportClient.builder().settings(settings).build();	                     
		
		try {
			
	        client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(hostName), port));
	        BulkRequestBuilder bulkRequest = client.prepareBulk();	     
	        
	        for(int i=1; i< itemsPerBatch; i++){
		        random.nextInt(10);
		        int host=random.nextInt(20);
		   
		        bulkRequest.add(client.prepareIndex(indexName, typeName).setId(UUID.randomUUID().toString()).setSource(XContentFactory.jsonBuilder()
		        	
			        .startObject()			        			        			            		        
			            .field("@timestamp", new Date())
    			        .field("name", names[random.nextInt(names.length)])
	    		        .field("message", messages[random.nextInt(messages.length)])
		    	        .field("severityCode", random.nextInt(10))
			            .field("severity", severity[random.nextInt(severity.length)])
			            .field("hostname", "Hostname"+host)
			            .field("hostip", "10.1.0."+host)
    			        .field("pid",random.nextInt(10))
	    		        .field("tid",random.nextInt(10))
		    	        .field("appId", apps[random.nextInt(apps.length)])
			            .field("appName", "application"+host)
			            .field("appVersion", random.nextInt(5))
			            .field("type", random.nextInt(6))
    			        .field("subtype", random.nextInt(6))
	    		        .field("correlationId", UUID.randomUUID().toString())
		    	        .field("os", "linux")
			            .field("osVersion", "14.1.5")
			            .field("parameters", "{ke:value,key:value}")
			        .endObject()
			        )
			    );
		    }
		    BulkResponse bulkResponse = bulkRequest.execute().actionGet();
		    assertFalse(bulkResponse.buildFailureMessage(), bulkResponse.hasFailures());
	    }
        finally {
            client.close();
        }
    }
	
	@After
	public void tearDown() throws Exception {
	}
}