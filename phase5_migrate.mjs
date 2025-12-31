import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

async function migrateConversationSummaries() {
  try {
    await client.connect();
    console.log('✅ Connected to Neon database\n');

    console.log('📋 PHASE 5: CONVERSATION_SUMMARIES TABLE MIGRATION\n');

    // Step 1: Rename 'summary' to 'summary_text'
    console.log('Step 1: Renaming column summary → summary_text...');
    await client.query(`
      ALTER TABLE conversation_summaries 
      RENAME COLUMN summary TO summary_text;
    `);
    console.log('✅ Column renamed: summary → summary_text\n');

    // Step 2: Rename 'model' to 'model_used'
    console.log('Step 2: Renaming column model → model_used...');
    await client.query(`
      ALTER TABLE conversation_summaries 
      RENAME COLUMN model TO model_used;
    `);
    console.log('✅ Column renamed: model → model_used\n');

    // Step 3: Add 'key_topics' column (jsonb)
    console.log('Step 3: Adding key_topics column (jsonb)...');
    await client.query(`
      ALTER TABLE conversation_summaries 
      ADD COLUMN key_topics jsonb;
    `);
    console.log('✅ Column added: key_topics (jsonb)\n');

    // Verify the changes
    console.log('📋 Verifying final structure...\n');
    const result = await client.query(`
      SELECT 
        column_name,
        data_type,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'conversation_summaries'
      ORDER BY ordinal_position;
    `);

    console.log('✅ FINAL CONVERSATION_SUMMARIES TABLE STRUCTURE:');
    console.table(result.rows);

    console.log('\n✅ PHASE 5 MIGRATION COMPLETE!\n');
    console.log('Expected columns:');
    console.log('1. id');
    console.log('2. conversation_id');
    console.log('3. summary_text');
    console.log('4. model_used');
    console.log('5. token_count');
    console.log('6. key_topics (jsonb)');
    console.log('7. created_at');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrateConversationSummaries();
