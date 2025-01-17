const QNode = require('../../src/query_node');
const QEdge = require('../../src/query_edge');
const QueryResult = require('../../src/query_results');

describe('Testing QueryResults Module', () => {
  describe('Single Record', () => {
    const gene_node1 = new QNode('n1', { categories: 'Gene', ids: 'NCBIGene:632' });
    const chemical_node1 = new QNode('n2', { categories: 'SmallMolecule' });
    const edge1 = new QEdge('e01', { subject: gene_node1, object: chemical_node1 });
    const record = {
      $edge_metadata: {
        trapi_qEdge_obj: edge1,
        predicate: 'biolink:physically_interacts_with',
        source: 'DGIdb',
        api_name: 'BioThings DGIDB API',
      },
      publications: ['PMID:8366144', 'PMID:8381250'],
      relation: 'antagonist',
      source: 'DrugBank',
      score: '0.9',
      $input: {
        original: 'SYMBOL:BGLAP',
        obj: [
          {
            primaryID: 'NCBIGene:632',
            label: 'BGLAP',
            dbIDs: {
              SYMBOL: 'BGLAP',
              NCBIGene: '632',
            },
            curies: ['SYMBOL:BGLAP', 'NCBIGene:632'],
          },
        ],
      },
      $output: {
        original: 'CHEMBL.COMPOUND:CHEMBL1200983',
        obj: [
          {
            primaryID: 'CHEMBL.COMPOUND:CHEMBL1200983',
            label: 'GALLIUM NITRATE',
            dbIDs: {
              'CHEMBL.COMPOUND': 'CHEMBL1200983',
              'PUBCHEM.COMPOUND': '5282394',
              name: 'GALLIUM NITRATE',
            },
            curies: ['CHEMBL.COMPOUND:CHEMBL1200983', 'PUBCHEM.COMPOUND:5282394', 'name:GALLIUM NITRATE'],
          },
        ],
      },
    };

    describe('Testing update function', () => {
      test('test when input with string, should output a hash of 40 characters', () => {
        const queryResult = new QueryResult();
        queryResult.update([record]);
        expect(queryResult.getResults().length).toEqual(1);
        expect(queryResult.getResults()[0].node_bindings).toHaveProperty('n1');
        expect(queryResult.getResults()[0].edge_bindings).toHaveProperty('e01');
        expect(queryResult.getResults()[0]).toHaveProperty('score');
      });
    });
  });

  describe('Two Records', () => {
    const gene_node_start = new QNode('n1', { categories: 'Gene', ids: 'NCBIGene:3778' });
    const disease_node = new QNode('n2', { categories: 'Disease' });
    const gene_node_end = new QNode('n3', { categories: 'Gene' });

    const edge1 = new QEdge('e01', { subject: gene_node_start, object: disease_node });
    const edge2 = new QEdge('e02', { subject: disease_node, object: gene_node_end });

    const record1 = {
      $edge_metadata: {
        trapi_qEdge_obj: edge1,
        predicate: 'biolink:gene_associated_with_condition',
        api_name: 'Automat Pharos',
      },
      publications: ['PMID:123', 'PMID:1234'],
      $input: {
        original: 'SYMBOL:KCNMA1',
        obj: [
          {
            primaryID: 'NCBIGene:3778',
            label: 'KCNMA1',
            dbIDs: {
              SYMBOL: 'KCNMA1',
              NCBIGene: '3778',
            },
            curies: ['SYMBOL:KCNMA1', 'NCBIGene:3778'],
          },
        ],
      },
      $output: {
        original: 'MONDO:0011122',
        obj: [
          {
            primaryID: 'MONDO:0011122',
            label: 'obesity disorder',
            dbIDs: {
              MONDO: '0011122',
              MESH: 'D009765',
              name: 'obesity disorder',
            },
            curies: ['MONDO:0011122', 'MESH:D009765', 'name:obesity disorder'],
          },
        ],
      },
    };

    const record2 = {
      $edge_metadata: {
        trapi_qEdge_obj: edge2,
        predicate: 'biolink:condition_associated_with_gene',
        api_name: 'Automat Hetio',
      },
      publications: ['PMID:345', 'PMID:456'],
      $input: {
        original: 'MONDO:0011122',
        obj: [
          {
            primaryID: 'MONDO:0011122',
            label: 'obesity disorder',
            dbIDs: {
              MONDO: '0011122',
              MESH: 'D009765',
              name: 'obesity disorder',
            },
            curies: ['MONDO:0011122', 'MESH:D009765', 'name:obesity disorder'],
          },
        ],
      },
      $output: {
        original: 'SYMBOL:TULP3',
        obj: [
          {
            primaryID: 'NCBIGene:7289',
            label: 'TULP3',
            dbIDs: {
              SYMBOL: 'TULP3',
              NCBIGene: '7289',
            },
            curies: ['SYMBOL:TULP3', 'NCBIGene:7289'],
          },
        ],
      },
    };

    describe('Testing update function', () => {
      test('should get n1, n2, n3 and e01, e02', () => {
        const queryResult = new QueryResult();

        queryResult.update([record1]);
        queryResult.update([record2]);

        const results = queryResult.getResults();

        expect(results.length).toEqual(1);

        expect(Object.keys(results[0].node_bindings).length).toEqual(3);
        expect(results[0].node_bindings).toHaveProperty('n1');
        expect(results[0].node_bindings).toHaveProperty('n2');
        expect(results[0].node_bindings).toHaveProperty('n3');

        expect(Object.keys(results[0].edge_bindings).length).toEqual(2);
        expect(results[0].edge_bindings).toHaveProperty('e01');
        expect(results[0].edge_bindings).toHaveProperty('e02');

        expect(results[0]).toHaveProperty('score');
      });
    });
  });

  describe('Three Records', () => {
    const gene_node_start = new QNode('n1', { categories: 'Gene', ids: 'NCBIGene:3778' });
    const disease_node = new QNode('n2', { categories: 'Disease' });
    const gene_node_end1 = new QNode('n3', { categories: 'Gene' });
    const gene_node_end2 = new QNode('n4', { categories: 'Gene' });

    const edge1 = new QEdge('e01', { subject: gene_node_start, object: disease_node });
    const edge2 = new QEdge('e02', { subject: disease_node, object: gene_node_end1 });
    const edge3 = new QEdge('e03', { subject: disease_node, object: gene_node_end2 });

    const record1 = {
      $edge_metadata: {
        trapi_qEdge_obj: edge1,
        predicate: 'biolink:gene_associated_with_condition',
        api_name: 'Automat Pharos',
      },
      publications: ['PMID:123', 'PMID:1234'],
      $input: {
        original: 'SYMBOL:KCNMA1',
        obj: [
          {
            primaryID: 'NCBIGene:3778',
            label: 'KCNMA1',
            dbIDs: {
              SYMBOL: 'KCNMA1',
              NCBIGene: '3778',
            },
            curies: ['SYMBOL:KCNMA1', 'NCBIGene:3778'],
          },
        ],
      },
      $output: {
        original: 'MONDO:0011122',
        obj: [
          {
            primaryID: 'MONDO:0011122',
            label: 'obesity disorder',
            dbIDs: {
              MONDO: '0011122',
              MESH: 'D009765',
              name: 'obesity disorder',
            },
            curies: ['MONDO:0011122', 'MESH:D009765', 'name:obesity disorder'],
          },
        ],
      },
    };

    const record2 = {
      $edge_metadata: {
        trapi_qEdge_obj: edge2,
        predicate: 'biolink:condition_associated_with_gene',
        api_name: 'Automat Hetio',
      },
      publications: ['PMID:345', 'PMID:456'],
      $input: {
        original: 'MONDO:0011122',
        obj: [
          {
            primaryID: 'MONDO:0011122',
            label: 'obesity disorder',
            dbIDs: {
              MONDO: '0011122',
              MESH: 'D009765',
              name: 'obesity disorder',
            },
            curies: ['MONDO:0011122', 'MESH:D009765', 'name:obesity disorder'],
          },
        ],
      },
      $output: {
        original: 'SYMBOL:TULP3',
        obj: [
          {
            primaryID: 'NCBIGene:7289',
            label: 'TULP3',
            dbIDs: {
              SYMBOL: 'TULP3',
              NCBIGene: '7289',
            },
            curies: ['SYMBOL:TULP3', 'NCBIGene:7289'],
          },
        ],
      },
    };

    const record3 = {
      $edge_metadata: {
        trapi_qEdge_obj: edge3,
        predicate: 'biolink:condition_associated_with_gene',
        api_name: 'Automat Hetio',
      },
      publications: ['PMID:987', 'PMID:876'],
      $input: {
        original: 'MONDO:0011122',
        obj: [
          {
            primaryID: 'MONDO:0011122',
            label: 'obesity disorder',
            dbIDs: {
              MONDO: '0011122',
              MESH: 'D009765',
              name: 'obesity disorder',
            },
            curies: ['MONDO:0011122', 'MESH:D009765', 'name:obesity disorder'],
          },
        ],
      },
      $output: {
        original: 'SYMBOL:TECR',
        obj: [
          {
            primaryID: 'NCBIGene:9524',
            label: 'TECR',
            dbIDs: {
              SYMBOL: 'TECR',
              NCBIGene: '9524',
            },
            curies: ['SYMBOL:TECR', 'NCBIGene:9524'],
          },
        ],
      },
    };

    describe('Testing update function', () => {
      test('should get a single-hop followed by a forked second hop', () => {
        const queryResult = new QueryResult();

        queryResult.update([record1]);
        queryResult.update([record2, record3]);

        const results = queryResult.getResults();

        expect(results.length).toEqual(2);

        expect(Object.keys(results[0].node_bindings).length).toEqual(3);
        expect(results[0].node_bindings).toHaveProperty('n1');
        expect(results[0].node_bindings).toHaveProperty('n2');
        expect(results[0].node_bindings).toHaveProperty('n3');

        expect(Object.keys(results[0].edge_bindings).length).toEqual(2);
        expect(results[0].edge_bindings).toHaveProperty('e01');
        expect(results[0].edge_bindings).toHaveProperty('e02');

        expect(results[0]).toHaveProperty('score');

        expect(Object.keys(results[1].node_bindings).length).toEqual(3);
        expect(results[1].node_bindings).toHaveProperty('n1');
        expect(results[1].node_bindings).toHaveProperty('n2');
        expect(results[1].node_bindings).toHaveProperty('n4');

        expect(Object.keys(results[1].edge_bindings).length).toEqual(2);
        expect(results[1].edge_bindings).toHaveProperty('e01');
        expect(results[1].edge_bindings).toHaveProperty('e03');

        expect(results[1]).toHaveProperty('score');
      });
    });
  });
});
