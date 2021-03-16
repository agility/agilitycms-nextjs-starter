import { FC, PropsWithChildren, ReactElement } from 'react'

export interface CustomInitPropsArg {
	item: any
	agility: any
	languageCode: any
	channelName: any
	pageInSitemap: any
	dynamicPageItem?: any
}

export interface CustomInitProps<T> {
	(props: CustomInitPropsArg): T;
}

export interface ModuleWithInit<TProps, TInit> extends FC<TProps> {
	getCustomInitialProps?(props:CustomInitPropsArg): Promise<TInit>
}

export interface ContentItem<T> {
	contentID: number
	properties: any
	fields:T
}

export interface ImageField {
	label: string
	url: string
	target: string
	filesize: Number
	height: Number
	width: Number
}

export interface URLField {
	href: string
	target: string
	text: string
}