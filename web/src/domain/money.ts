export type Cents = number & { readonly __cents: unique symbol };

export function cents(value: number, signed = false): Cents {
  if (!Number.isSafeInteger(value) || (!signed && value < 0)) {
    throw new Error('Enter a safe whole number of cents.');
  }
  return (Object.is(value, -0) ? 0 : value) as Cents;
}

export function parseMoney(input: string, signed = false): Cents {
  const match = /^(?<sign>-?)(?<whole>0|[1-9]\d*)(?:\.(?<fraction>\d{1,2}))?$/.exec(input);
  if (!match?.groups || (!signed && match.groups.sign)) {
    throw new Error('Use dollars with up to two decimal places, such as 12.50.');
  }
  const magnitude = BigInt(match.groups.whole) * 100n + BigInt((match.groups.fraction ?? '').padEnd(2, '0'));
  const result = match.groups.sign ? -magnitude : magnitude;
  if (result > BigInt(Number.MAX_SAFE_INTEGER) || result < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new Error('Amount is outside the supported range.');
  }
  return cents(Number(result), signed);
}

export function formatMoney(value: Cents): string {
  const raw = BigInt(cents(value, true));
  const magnitude = raw < 0n ? -raw : raw;
  const dollars = (magnitude / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${raw < 0n ? '-' : ''}$${dollars}.${(magnitude % 100n).toString().padStart(2, '0')}`;
}

export function sumCents(values: readonly Cents[], signed = false): Cents {
  const total = values.reduce((sum, value) => sum + BigInt(cents(value, signed)), 0n);
  if (total > BigInt(Number.MAX_SAFE_INTEGER) || total < BigInt(Number.MIN_SAFE_INTEGER)) throw new Error('Amount overflow.');
  return cents(Number(total), signed);
}
