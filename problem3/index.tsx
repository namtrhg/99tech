// Computational Inefficiencies
// 1. Unnecessary Dependency in useMemo: price
// 2. Double Mapping for balances

// Anti-patterns
// 1. getPriority function can be move to util folder
// 2. lhsPriority is missing
// 3. When mapping I usally avoid using index as key
// 4. lhsPriority > -99 should be balancePriority > -99

// Refactor
// 1. interface FormattedWalletBalance should extends from interface WalletBalance.
// 2. We can combine filter, map oparation for formattedBalances into 1 function.
// 3. Update the key when mapping

// util
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return -99;
  }
};

interface WalletBalance {
	currency: string;
	amount: number;
	blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
	formatted: string;
	usdValue: number;
}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
	const balances = useWalletBalances();
	const prices = usePrices();

	const formattedBalances = useMemo(() => {
		return balances
			.filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
			.sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
			.map((balance) => ({
				...balance,
				formatted: balance.amount.toFixed(),
				usdValue: prices[balance.currency] * balance.amount,
			}));
	}, [balances, prices, getPriority]);

	return (
		<div {...rest}>
			{formattedBalances.map((balance, index) => (
				<WalletRow
					className={classes.row}
					key={`${balance.currency}-${index}`}
					amount={balance.amount}
					usdValue={balance.usdValue}
					formattedAmount={balance.formatted}
				/>
			))}
		</div>
	);
};
