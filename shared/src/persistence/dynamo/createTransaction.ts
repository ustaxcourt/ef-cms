export type TTransactionMethod = 'Update' | 'Put' | 'Delete';

export type TTransactionItem = Partial<Record<TTransactionMethod, any>>;

export const createTransaction = () => {
  const transaction: TTransactionItem[] = [];

  return {
    add(transactionItem: TTransactionItem) {
      transaction.push(transactionItem);
    },
    commit({ applicationContext }) {
      return applicationContext
        .getDocumentClient()
        .transactWrite({
          TransactItems: transaction,
        })
        .promise();
    },
  };
};

export type TransactionBuilder = ReturnType<typeof createTransaction>;
