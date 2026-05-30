drop table if exists  users; 
drop table if exists workspaces;
drop table if exists workflows;
drop table if exists executions;
drop table if exists executionNodeData;

create table users (
	id int generated always as identity primary key not null,
	firstName varchar(100) not null,
	lastName varchar(100) not null,
	username varchar(100) not null unique,
	email varchar(100) not null unique,
	passwordHash text not null,
	createdAt timestamp default now(),
	updatedAt timestamp default now()
);

create table workspaces (
	id int generated always as identity primary key not null,
	name varchar(100),
	ownerId int not null,
	createdAt timestamp default now(),

	constraint fk_w_o foreign key (ownerId) references users(id) on delete cascade
);

create table workflows (
	id int generated always as identity primary key not null,
	workspaceId int not null,
	ownerId int not null,
	name varchar(100),
	description text, 
	active boolean not null,
	triggerType varchar(100) not null,
	triggerConfig jsonb, 
	settings text,
	nodes jsonb not null,
	edges jsonb not null,
	createdAt timestamp default now(),
	updatedAt timestamp default now(),

	constraint fk_w_w foreign key (workspaceId) references workspaces(id),
	constraint fk_w_o foreign key (ownerId) references users(id)
);

create table executions (
	id int generated always as identity primary key not null,
	workflowId int not null,
	status varchar(100) not null,
	triggerData jsonb,
	startedAt timestamp default now() not null,
	finishedAt timestamp,
	duration int,
	errorMessage varchar(100),

	constraint fk_e_w foreign key (workflowId) references workflows(id) on delete cascade
);

create table executionNodeData (
	id int generated always as identity primary key,
	executionId int not null,
	nodeId int not null,
	status varchar(100),
	inputData text,
	outputData text,
	errorMessage varchar(100),
	executionTime int,
	startedAt timestamp default now(),

	constraint fk_en_e foreign key (executionId) references executions(id) on delete cascade
);
