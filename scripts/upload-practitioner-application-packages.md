# Importing practitioners' application packages

Practitioners' application packages include their initial application to practice law before the Tax Court and any other documents pertaining to their admission status. These application packages have been exported from Blackstone in `.tif` format, one file per practitioner. Each filename should contain an exact bar number.

## Prepare the `upload` directory

If you already have a directory called `$HOME/Documents/upload`, this will rename it and create a fresh directory for your uploads.

```bash
[ -d "$HOME/Documents/upload" ] && mv "$HOME/Documents/upload" "$HOME/Documents/upload-bak-$(date +%s)"
mkdir -p "$HOME/Documents/upload/to-upload"
mkdir -p "$HOME/Documents/upload/done/original"
mkdir "$HOME/Documents/upload/done/uploaded"
```

## Prepare the dataset

Application package files are organized in folders, but you just want the `.tif` files. Because these files came from Windows, they will have mixed case, so you'll have to use case-insensitive matching. Change `$HOME/Downloads/practitioner-admissions` to the path containing the directories of `.tif` files.

```bash
cd "$HOME/Downloads/practitioner-admissions"
find . -iname "*.tif" -exec cp {} $HOME/Documents/upload/to-upload/ \;
echo "Total: $(find "$HOME/Documents/upload/to-upload" -iname "*.tif" | wc -l)"
```

## Prepare your shell

Use the [environment switcher](/scripts/env/environment-switcher.md) to set your shell session's environment variables to point to the DAWSON environment into which you intend to import the application packages. Change `test` to your desired environment.

```bash
cd "$HOME/path/to/ef-cms"
. scripts/env/set-env.zsh test
```

## Import practitioners' application packages

In the same shell session, run the `upload-practitioner-application-packages` script.

```bash
npx ts-node --transpile-only scripts/upload-practitioner-application-packages.js > "$HOME/Documents/upload/stats-$(date +%s).txt"
```

## Evaluate the results

Any files that could not be uploaded will remain in the `to-upload` directory. A `results.json` file will have been written to the `upload` directory, as well as a `stats.txt` file. Inspect the `results.json` file and ensure that the total number of files uploaded to S3 matches the total number of documents inserted in DynamoDB.

Lastly, as an admissions clerk, log in to the DAWSON environment into which you just imported the practitioners' application packages, navigate to a practitioner's documents, and ensure you see the imported application package.
